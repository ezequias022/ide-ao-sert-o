import { logoBase64 } from './logo-base64.js'
import { supabase } from './supabase.js'

export async function gerarCertificadoPDF(usuarioId, eventoId) {

  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome, genero')
    .eq('id', usuarioId)
    .single()

  const { data: evento } = await supabase
    .from('eventos')
    .select('nome, data_inicio, data_fim, local')
    .eq('id', eventoId)
    .single()

  if (!perfil || !evento) {
    alert('Erro ao buscar dados para o certificado.')
    return null
  }

const dI = new Date(evento.data_inicio + 'T00:00:00')
const dF = new Date(evento.data_fim + 'T00:00:00')
const mes = dI.toLocaleDateString('pt-BR', { month: 'long' })
const ano = dI.getFullYear()
const dataInicio = dI.getDate()
const dataFim = dF.getDate()
const dataFormatada = `${dataInicio} e ${dataFim} de ${mes} de ${ano}`
  const termo = perfil.genero === 'feminino' ? 'missionária voluntária' : 'missionário voluntário'

  const svgContent = `
<svg width="800" height="566" viewBox="0 0 800 566" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="800" height="566" fill="#FAF3E0"/>
  <rect x="12" y="12" width="776" height="542" fill="none" stroke="#B5541A" stroke-width="3" rx="6"/>
  <rect x="21" y="21" width="758" height="524" fill="none" stroke="#F5C200" stroke-width="1.5" rx="4"/>
  <circle cx="35" cy="35" r="7" fill="#F5C200"/>
  <circle cx="765" cy="35" r="7" fill="#F5C200"/>
  <circle cx="35" cy="531" r="7" fill="#F5C200"/>
  <circle cx="765" cy="531" r="7" fill="#F5C200"/>
  <rect x="12" y="12" width="776" height="72" fill="#3D2B1F" rx="5"/>
  <rect x="12" y="68" width="776" height="18" fill="#B5541A"/>
  <text x="400" y="40" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="700" fill="#FAF3E0" letter-spacing="4">MISSÃO IDE AO SERTÃO</text>
  <text x="400" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#F5C200" letter-spacing="3">Eu Vou Pregar no Sertão</text>
  <text x="400" y="79" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#FAF3E0" letter-spacing="2">CERTIFICADO DE PARTICIPAÇÃO</text>
<image href="${logoBase64}" x="360" y="88" width="80" height="80"/>
  <!-- Cactus esquerdo -->
  <rect x="48" y="290" width="12" height="150" fill="#5A8A3C" rx="6"/>
  <rect x="28" y="370" width="22" height="9" fill="#5A8A3C" rx="4"/>
  <rect x="28" y="349" width="9" height="30" fill="#5A8A3C" rx="4"/>
  <rect x="60" y="395" width="22" height="9" fill="#5A8A3C" rx="4"/>
  <rect x="73" y="374" width="9" height="30" fill="#5A8A3C" rx="4"/>
  <line x1="44" y1="320" x2="38" y2="315" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="44" y1="340" x2="38" y2="335" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="44" y1="360" x2="38" y2="355" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="60" y1="320" x2="66" y2="315" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="60" y1="340" x2="66" y2="335" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="60" y1="360" x2="66" y2="355" stroke="#3D6B28" stroke-width="1.5"/>
  <ellipse cx="54" cy="440" rx="20" ry="6" fill="#C4956A" opacity="0.5"/>

  <!-- Cactus direito -->
  <rect x="740" y="290" width="12" height="150" fill="#5A8A3C" rx="6"/>
  <rect x="720" y="395" width="22" height="9" fill="#5A8A3C" rx="4"/>
  <rect x="720" y="374" width="9" height="30" fill="#5A8A3C" rx="4"/>
  <rect x="752" y="370" width="22" height="9" fill="#5A8A3C" rx="4"/>
  <rect x="765" y="349" width="9" height="30" fill="#5A8A3C" rx="4"/>
  <line x1="736" y1="320" x2="730" y2="315" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="736" y1="340" x2="730" y2="335" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="736" y1="360" x2="730" y2="355" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="752" y1="320" x2="758" y2="315" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="752" y1="340" x2="758" y2="335" stroke="#3D6B28" stroke-width="1.5"/>
  <line x1="752" y1="360" x2="758" y2="355" stroke="#3D6B28" stroke-width="1.5"/>
  <ellipse cx="746" cy="440" rx="20" ry="6" fill="#C4956A" opacity="0.5"/>

  <text x="400" y="185" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#5C3D2E">Certificamos que</text>
  <text x="400" y="210" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#3D2B1F">${perfil.nome}</text>
  <line x1="120" y1="220" x2="680" y2="220" stroke="#B5541A" stroke-width="1"/>
  <text x="400" y="258" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#5C3D2E">participou como ${termo} no</text>
  <text x="400" y="295" text-anchor="middle" font-family="Georgia, serif" font-size="19" font-weight="700" fill="#B5541A">${evento.nome}</text>
  <text x="400" y="325" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#5C3D2E">realizado nos dias</text>
  <text x="400" y="350" text-anchor="middle" font-family="Georgia, serif" font-size="17" font-weight="700" fill="#3D2B1F">${dataFormatada}</text>
  <rect x="140" y="368" width="520" height="48" fill="#FFF8D6" rx="4" stroke="#F5C200" stroke-width="1"/>
  <text x="400" y="388" text-anchor="middle" font-family="Georgia, serif" font-size="12" font-style="italic" fill="#5C3D2E">"Ide por todo o mundo e pregai o Evangelho a toda criatura."</text>
  <text x="400" y="407" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#8C5A2E">Marcos 16:15</text>
  <text x="400" y="497" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="700" fill="#3D2B1F">Ademilson Campos de Araújo</text>
  <text x="400" y="514" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#8C5A2E" letter-spacing="1">Presidente — Missão Ide ao Sertão</text>
  <rect x="12" y="542" width="776" height="12" fill="#3D2B1F" rx="3"/>
  <text x="400" y="552" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="#F5C200" letter-spacing="2">missaoideaosertao.com.br</text>
</svg>`

  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 849
  const ctx = canvas.getContext('2d')

  const img = new Image()
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve) => {
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, 1200, 849)
      URL.revokeObjectURL(url)

      canvas.toBlob(async (blob) => {
        const nomeArquivo = `${usuarioId}_${eventoId}.png`

        const { data, error } = await supabase.storage
          .from('certificados')
          .upload(nomeArquivo, blob, {
            contentType: 'image/png',
            upsert: true
          })

        if (error) {
          console.error('Erro ao salvar certificado:', error)
          resolve(null)
          return
        }

        const { data: urlData } = supabase.storage
          .from('certificados')
          .getPublicUrl(nomeArquivo)

        resolve(urlData.publicUrl)
      }, 'image/png')
    }
    img.src = url
  })
}