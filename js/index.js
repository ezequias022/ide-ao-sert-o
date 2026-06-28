import { supabase } from './supabase.js'

// Verificar login e ajustar página
async function verificarLogin() {
  const { data: { user } } = await supabase.auth.getUser()
  const navLogin = document.getElementById('nav-login')

  if (user) {
    // Buscar nome do perfil
    const { data: perfil } = await supabase.from('perfis').select('nome').eq('id', user.id).single()
    const nome = perfil?.nome.split(' ')[0] || 'Missionário'

    // Atualizar nav
    navLogin.textContent = `Olá, ${nome}`
    navLogin.href = 'painel.html'

    // Esconder seção cadastro e mostrar mensagem
    const participe = document.getElementById('participe')
    participe.innerHTML = `
      <div class="container" style="text-align:center;padding:3rem 2rem;">
        <p class="section-label">Você está conectado</p>
        <h2 class="section-title">Bem-vindo de volta, ${nome}!</h2>
        <div class="divider" style="margin:1rem auto;"></div>
        <p style="color:var(--texto-suave);margin-bottom:1.5rem;">Acesse seu painel para se inscrever no próximo evento e acompanhar sua jornada missionária.</p>
        <a href="painel.html" class="btn-primary">Acessar meu painel</a>
      </div>`
  }
}
// Carregar próximo evento
async function carregarProximoEvento() {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('ativo', true)
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

// Botão inscrever no evento — verifica se está logado
async function configurarBtnEvento() {
  const { data: { user } } = await supabase.auth.getUser()
  const btn = document.getElementById('btn-inscrever-evento')
  if (user) {
    btn.href = 'painel.html'
  } else {
    btn.href = 'login.html'
  }
}

// Formulário de cadastro
document.getElementById('inscricaoForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const nome = document.getElementById('nome').value
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value
  const telefone = document.getElementById('telefone').value
  const cidade = document.getElementById('cidade').value
  const estado_civil = document.getElementById('estado_civil').value
  const cidade_igreja = document.getElementById('cidade_igreja').value
  const nome_pastor = document.getElementById('nome_pastor').value
  const telefone_pastor = document.getElementById('telefone_pastor').value
  const batizado = document.getElementById('batizado').value === 'true'
  const experiencia_missionaria = document.getElementById('experiencia_missionaria').value === 'true'
  const habilidade = document.getElementById('habilidade').value
  const visao_missoes = document.getElementById('visao_missoes').value

  const botao = document.querySelector('.form-submit')
  botao.textContent = 'Cadastrando...'
  botao.disabled = true

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: senha })

  if (authError) {
    alert('Erro ao criar conta: ' + authError.message)
    botao.textContent = 'Criar minha conta'
    botao.disabled = false
    return
  }

  const genero = document.getElementById('genero').value
  const idade = parseInt(document.getElementById('idade').value) || null

  const { error: perfilError } = await supabase.from('perfis').insert({
    id: authData.user.id,
    nome,
    email,
    telefone,
    cidade,
    genero,
    idade,
    estado_civil,
    cidade_igreja,
    nome_pastor,
    telefone_pastor,
    batizado,
    experiencia_missionaria,
    habilidade,
    visao_missoes
  })

  if (perfilError) {
    console.error('Erro ao salvar perfil:', perfilError)
  }

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
configurarBtnEvento()
verificarLogin()