import { supabase } from './supabase.js'

// Carregar próximo evento
async function carregarProximoEvento() {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('ativo', true)
    .gte('data_inicio', new Date().toISOString().split('T')[0])
    .order('data_inicio', { ascending: true })
    .limit(1)
    .single()

  if (error || !data) {
    document.getElementById('evento-nome').textContent = 'Em breve novo evento!'
    document.getElementById('evento-data').textContent = 'Fique de olho nas novidades'
    document.getElementById('evento-local').textContent = 'Sertão nordestino'
    document.getElementById('evento-descricao').textContent = 'Novos impactos evangelísticos estão sendo planejados.'
    return
  }

  const dataInicio = new Date(data.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const dataFim = new Date(data.data_fim + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  document.getElementById('evento-nome').textContent = data.nome
  document.getElementById('evento-data').textContent = `${dataInicio} a ${dataFim}`
  document.getElementById('evento-local').textContent = data.local
  document.getElementById('evento-descricao').textContent = data.descricao
}

// Formulário de inscrição
document.getElementById('inscricaoForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const nome = document.getElementById('nome').value
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value
  const telefone = document.getElementById('telefone').value
  const cidade = document.getElementById('cidade').value
  const habilidade = document.getElementById('habilidade').value
  const motivacao = document.getElementById('motivacao').value

  const botao = document.querySelector('.form-submit')
  botao.textContent = 'Cadastrando...'
  botao.disabled = true

  // Criar conta no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: senha
  })

  if (authError) {
    alert('Erro ao criar conta: ' + authError.message)
    botao.textContent = 'Criar conta e se inscrever'
    botao.disabled = false
    return
  }

  // Salvar perfil
  const { error: perfilError } = await supabase
    .from('perfis')
    .insert({
      id: authData.user.id,
      nome,
      email,
      telefone,
      cidade
    })

  if (perfilError) {
    console.error('Erro ao salvar perfil:', perfilError)
  }

  // Buscar próximo evento ativo
  const { data: evento } = await supabase
    .from('eventos')
    .select('id')
    .eq('ativo', true)
    .order('data_inicio', { ascending: true })
    .limit(1)
    .single()

  // Salvar inscrição
  if (evento) {
    await supabase.from('inscricoes').insert({
      usuario_id: authData.user.id,
      evento_id: evento.id,
      habilidade,
      motivacao,
      status: 'pendente'
    })
  }

  // Mostrar sucesso
  document.getElementById('formCard').style.display = 'none'
  document.getElementById('formSucesso').style.display = 'block'
})

// Menu mobile
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open')
})

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open')
  })
})

// Inicializar
carregarProximoEvento()