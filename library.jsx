// Trainer Nico — Biblioteca REAL de ejercicios (Google Drive).
// Cada ejercicio referencia su infografía en Drive vía lh3.googleusercontent.com.
// Las imágenes son fichas completas (músculos, pasos, tips, errores).

// Build a renderable image URL from a Drive file id.
function driveImg(id, w = 1200) {
  return `https://lh3.googleusercontent.com/d/${id}=w${w}`;
}

// group, equipment, level inferred from Nico's library.
// d = Drive file id.
const LIBRARY = [
  // ─── PECHO ───
  { id: 'press-banca-plano', es: 'Press de banca plano', group: 'Pecho', equipment: 'Barra', level: 'Intermedio', d: '18v1iO8crIFkL2-PdIrCD7l4tNhv4AAhY' },
  { id: 'press-inclinado', es: 'Press de banca inclinado', group: 'Pecho', equipment: 'Barra', level: 'Intermedio', d: '1DBunxRsGGpQDJNPT7Juv_5l-W6407rHW' },
  { id: 'press-declinado', es: 'Press de banca declinado', group: 'Pecho', equipment: 'Barra', level: 'Intermedio', d: '1UxZvR5tfaAhYKH-WrkPtxcBOyDaQGJkW' },
  { id: 'press-plano-mancuernas', es: 'Press plano con mancuernas', group: 'Pecho', equipment: 'Mancuernas', level: 'Intermedio', d: '1xFt9Bo8TwVszcZ6zmvsSqHKEfbYNXn3S' },
  { id: 'aperturas-mancuernas', es: 'Aperturas con mancuernas', group: 'Pecho', equipment: 'Mancuernas', level: 'Principiante', d: '1301SGO-TckdmfSYX7FQQ8UUw7yVLDERH' },
  { id: 'aperturas-inclinadas', es: 'Aperturas inclinadas', group: 'Pecho', equipment: 'Mancuernas', level: 'Principiante', d: '1s_XbPmJ_OldzhJ_rAe8GEd6j0OkDpPW5' },
  { id: 'cruces-polea-alta', es: 'Cruces en polea alta', group: 'Pecho', equipment: 'Polea', level: 'Intermedio', d: '1hSxlt9eZZaZvwY1CzEK5EunIKkxPQQad' },
  { id: 'cruces-polea-media', es: 'Cruces en polea media', group: 'Pecho', equipment: 'Polea', level: 'Intermedio', d: '1IeoMy-ePkI8udq3IrzUMi1x1tLi9dHJK' },
  { id: 'cruces-polea-baja', es: 'Cruces en polea baja', group: 'Pecho', equipment: 'Polea', level: 'Intermedio', d: '1H5LQWvTY65kPFd-G54LYKyyxhvrMrPFH' },
  { id: 'peck-deck', es: 'Peck deck', group: 'Pecho', equipment: 'Máquina', level: 'Principiante', d: '1m5JKbTZ7PqRzJ6e3-54_uz2BbSjf3i8N' },
  { id: 'press-convergente', es: 'Press convergente en máquina', group: 'Pecho', equipment: 'Máquina', level: 'Principiante', d: '11UunlK7NZ9opC0DJkrUM5_C4mk0bxxfk' },
  { id: 'fondos-pecho', es: 'Fondos para pecho', group: 'Pecho', equipment: 'Peso corporal', level: 'Avanzado', d: '1K7HWCcVY-StrVzaJaZNqEnZOX9XzHADn' },
  { id: 'flexiones', es: 'Flexiones', group: 'Pecho', equipment: 'Peso corporal', level: 'Principiante', d: '1Mse4sgM5NminTtAYcyu-Uy9GwhLYoPI3' },
  { id: 'flexiones-inclinadas', es: 'Flexiones inclinadas', group: 'Pecho', equipment: 'Peso corporal', level: 'Principiante', d: '1jlDVvU_F8yEtqwgKv8rgnjGfrt45hsaH' },

  // ─── ESPALDA ───
  { id: 'dominadas', es: 'Dominadas', group: 'Espalda', equipment: 'Peso corporal', level: 'Avanzado', d: '1qD8KMXI4PHhoBZJln99sIe3BiDOVE7EW' },
  { id: 'dominadas-supinas', es: 'Dominadas supinas', group: 'Espalda', equipment: 'Peso corporal', level: 'Avanzado', d: '17f2XWM2vbTq4ePQ9sGlI0Q0Q6KKtQJqz' },
  { id: 'dominadas-asistidas', es: 'Dominadas asistidas', group: 'Espalda', equipment: 'Máquina', level: 'Principiante', d: '1njm_nXvBWkM3QwBup9jb3HGy4w6_gD6q' },
  { id: 'remo-barra', es: 'Remo con barra', group: 'Espalda', equipment: 'Barra', level: 'Intermedio', d: '1hocmzRzXQghqEfCtaF_UWLDRKWME_e0b' },
  { id: 'remo-hammer', es: 'Remo Hammer', group: 'Espalda', equipment: 'Máquina', level: 'Intermedio', d: '1aH3n3hjDW7wO6HFzxAIFfqx65IioOIVw' },
  { id: 'remo-maquina', es: 'Remo en máquina', group: 'Espalda', equipment: 'Máquina', level: 'Principiante', d: '1gcSOhmzmW8VLOvDFOa9P8Olbhqx0HKcB' },
  { id: 'remo-t', es: 'Remo T', group: 'Espalda', equipment: 'Barra', level: 'Intermedio', d: '1-WpKxBxVbNlFXVJGh7DA5M1eV9tf7yJ_' },
  { id: 'remo-banco-inclinado', es: 'Remo pecho apoyado en banco inclinado', group: 'Espalda', equipment: 'Mancuernas', level: 'Intermedio', d: '1jjhl37ChnWDnW3z_N8Qh1pxhnO-R9tTp' },
  { id: 'remo-invertido', es: 'Remo invertido', group: 'Espalda', equipment: 'Peso corporal', level: 'Principiante', d: '1pXdd1NPU295sDtZS1XR1QeNXg0-FqCEb' },
  { id: 'jalon-pecho', es: 'Jalón al pecho', group: 'Espalda', equipment: 'Polea', level: 'Principiante', d: '1DRmceZeWK34OQxkWIT134j2tSNdfZGaR' },
  { id: 'jalon-trasnuca', es: 'Jalón tras nuca', group: 'Espalda', equipment: 'Polea', level: 'Intermedio', d: '1t-QoEInKuTBUUiz4s7l21T2IEuT1p6R9' },
  { id: 'jalon-cerrado', es: 'Jalón agarre cerrado', group: 'Espalda', equipment: 'Polea', level: 'Principiante', d: '1IYysjE2JfxQgDM6dr2rI1XvC_Zv1h6TD' },
  { id: 'jalon-amplio', es: 'Jalón con agarre amplio', group: 'Espalda', equipment: 'Polea', level: 'Principiante', d: '110zdWsMYJCpHkoj4j5d0mbWTqI9RBg2C' },
  { id: 'pull-over', es: 'Pull over con mancuernas', group: 'Espalda', equipment: 'Mancuernas', level: 'Intermedio', d: '132FTV3m0DqtHhBIg1KVcpmf35xMoAaya' },

  // ─── HOMBROS ───
  { id: 'press-militar-barra', es: 'Press militar con barra', group: 'Hombros', equipment: 'Barra', level: 'Intermedio', d: '1w9JrFaO-qUyCdTzLYt-NoLEgw6DaYLCX' },
  { id: 'press-militar-mancuernas', es: 'Press militar con mancuernas', group: 'Hombros', equipment: 'Mancuernas', level: 'Intermedio', d: '1ezz57RwTHcCBTPy0Q4iEypc2I05tTkJT' },
  { id: 'press-arnold', es: 'Press Arnold', group: 'Hombros', equipment: 'Mancuernas', level: 'Intermedio', d: '1UVHfcyArqA7IDrnXSLJzlrely6FJU6fv' },
  { id: 'press-hombros-maquina', es: 'Press de hombros en máquina', group: 'Hombros', equipment: 'Máquina', level: 'Principiante', d: '1GFX9gnIQqk4yNwoS5RUM6FUMk26tGwNR' },
  { id: 'elevaciones-laterales', es: 'Elevaciones laterales', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', d: '1__l3wZvp3KjgaziJA3qP7cZWiAQesXQ_' },
  { id: 'elevaciones-frontales', es: 'Elevaciones frontales', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', d: '1q1UWlxi-8KcTpV94q5_YXRmzl7hVZkO8' },
  { id: 'elevacion-frontal-disco', es: 'Elevación frontal con disco', group: 'Hombros', equipment: 'Máquina', level: 'Principiante', d: '1NthPexkyAx0BtxHzUQVVn3ASUsjv3i9K' },
  { id: 'remo-menton', es: 'Remo al mentón', group: 'Hombros', equipment: 'Barra', level: 'Intermedio', d: '1v5FeVcZ6Kz6MQHq_zzRG3HpZaey0LPub' },
  { id: 'pajaros-mancuernas', es: 'Pájaros con mancuernas', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', d: '1TYBzOqvTY6Bdb19kihEUkb77LYg-VEWH' },
  { id: 'pajaros-peck-deck', es: 'Pájaros en peck deck', group: 'Hombros', equipment: 'Máquina', level: 'Principiante', d: '1OByJ30M-9GIPk994gb0M1UumcG9WwcEU' },
  { id: 'face-pull-hombros', es: 'Face pull', group: 'Hombros', equipment: 'Polea', level: 'Principiante', d: '13R_Tw62u8De5njuoMTz9PMPCJis-YVvD' },
  { id: 'y-raise', es: 'Y-Raise en banco inclinado', group: 'Hombros', equipment: 'Mancuernas', level: 'Intermedio', d: '1nvfUNsSnRADpdrJ4yuRC-f5vdx7-1qgb' },
  { id: 'encogimientos', es: 'Encogimientos con mancuernas', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', d: '19MaubIBIb4YfZ26OhfZ4Vnfd2EY5zUdT' },

  // ─── BÍCEPS ───
  { id: 'curl-barra-z', es: 'Curl con barra Z', group: 'Bíceps', equipment: 'Barra', level: 'Principiante', d: '1pxojF3uzQpPZpIpKC91DaSkF4Cg5Kywc' },
  { id: 'curl-barra-recta', es: 'Curl con barra recta', group: 'Bíceps', equipment: 'Barra', level: 'Principiante', d: '1Sz8VVHA3dWLgDMwmtwpGVMTmYCrrG4JQ' },
  { id: 'curl-21', es: 'Curl 21', group: 'Bíceps', equipment: 'Barra', level: 'Intermedio', d: '19sqOfuN1IchIYcL-8dRSAk9sldPQ3M8S' },
  { id: 'curl-21-z', es: 'Curl 21 con barra Z', group: 'Bíceps', equipment: 'Barra', level: 'Intermedio', d: '1Fhvb2oYYv-kJjYa8CN4LqB3EWrSxYlX4' },
  { id: 'curl-alternado', es: 'Curl alternado con mancuernas', group: 'Bíceps', equipment: 'Mancuernas', level: 'Principiante', d: '1teYYSwljtP6NYvRYec5va43M7R0jrjYB' },
  { id: 'curl-inclinado', es: 'Curl inclinado con mancuernas', group: 'Bíceps', equipment: 'Mancuernas', level: 'Intermedio', d: '17ujwBLa7f1M012jmp7-4iPPXaAowBmUQ' },
  { id: 'curl-martillo', es: 'Curl martillo', group: 'Bíceps', equipment: 'Mancuernas', level: 'Principiante', d: '1tDu7HHdzvsWSK2OXcAXxePOrFRqNg9dt' },
  { id: 'curl-martillo-mancuernas', es: 'Curl martillo con mancuernas', group: 'Bíceps', equipment: 'Mancuernas', level: 'Principiante', d: '1b_8gHrXndHfNJiCoFWdvECr9JBUGp8Ry' },
  { id: 'curl-martillo-cuerda', es: 'Curl martillo con cuerda', group: 'Bíceps', equipment: 'Polea', level: 'Principiante', d: '1RQDZXatJt0G8esMvsEtGR7DytFL_bnUa' },
  { id: 'curl-concentrado', es: 'Curl concentrado', group: 'Bíceps', equipment: 'Mancuernas', level: 'Principiante', d: '1h-N-O94QI0oQiOyRBgmNcAanWt7yRozG' },
  { id: 'curl-predicador', es: 'Curl predicador en máquina', group: 'Bíceps', equipment: 'Máquina', level: 'Intermedio', d: '1SN7aeq3B8TF4DkxsrmVskUCzfodRxkhZ' },
  { id: 'curl-polea-baja', es: 'Curl en polea baja', group: 'Bíceps', equipment: 'Polea', level: 'Principiante', d: '1VI6UhfDA9e0ci767B1-Ed07juMWgunvL' },
  { id: 'curl-unilateral-polea', es: 'Curl unilateral en polea', group: 'Bíceps', equipment: 'Polea', level: 'Intermedio', d: '1VYaMxwOEaZtdJuq43WgY3QYFJHywvbvW' },
  { id: 'spider-curl', es: 'Spider curl', group: 'Bíceps', equipment: 'Mancuernas', level: 'Intermedio', d: '1uQtQbKE03iSX2Jd70Nq1clslDA-_TAnC' },

  // ─── TRÍCEPS ───
  { id: 'patada-triceps-polea', es: 'Patada de tríceps en polea', group: 'Tríceps', equipment: 'Polea', level: 'Principiante', d: '1_EDGF_Vuiw3_1syTlxk3y5n6JAaWMUa4' },
  { id: 'pres-frances-z', es: 'Press francés con barra Z', group: 'Tríceps', equipment: 'Barra', level: 'Intermedio', d: '1Frc04Ik9fpEZCFt15Go68eEpPOboFYjD' },
  { id: 'pres-frances-mancuernas', es: 'Press francés con mancuernas', group: 'Tríceps', equipment: 'Mancuernas', level: 'Intermedio', d: '1SVL-m1-IVvz-LZCSjeUrna7R1zf8t3Kh' },
  { id: 'extension-triceps-mancuernas', es: 'Extensión de tríceps con mancuernas', group: 'Tríceps', equipment: 'Mancuernas', level: 'Intermedio', d: '1LWFbYDTMwegFrIr_M8pBYJrFpr5PbFcd' },
  { id: 'extension-unilateral-polea', es: 'Extensión unilateral en polea', group: 'Tríceps', equipment: 'Polea', level: 'Principiante', d: '1O_NnnrxjYL_DPO_bRp3YY3CKPZd55wnk' },
  { id: 'extension-triceps-unilateral', es: 'Extensión de tríceps unilateral con mancuerna', group: 'Tríceps', equipment: 'Mancuernas', level: 'Intermedio', d: '16wBUvQMROJvgZyEj_1APY80tgiCHY5NG' },
  { id: 'press-triceps-maquina', es: 'Press de tríceps en máquina', group: 'Tríceps', equipment: 'Máquina', level: 'Principiante', d: '1CTpZOtvnCS-6pThE6-QDRKX6KoJ0FN97' },
  { id: 'press-cerrado', es: 'Press cerrado en banco plano', group: 'Tríceps', equipment: 'Barra', level: 'Intermedio', d: '10yq7zR1JZo_QglRpA6H3AVZe_a4d9-Kq' },
  { id: 'fondos-paralelas', es: 'Fondos en paralelas', group: 'Tríceps', equipment: 'Peso corporal', level: 'Avanzado', d: '1yIrJzmkY6QmVMqyM7qlTVTF6pdKJw5GF' },

  // ─── CUÁDRICEPS ───
  { id: 'sentadilla-libre', es: 'Sentadilla libre', group: 'Cuádriceps', equipment: 'Barra', level: 'Intermedio', d: '1CDy1MH2wVptnsYsNF4OaV81F8quvge_z' },
  { id: 'sentadilla-frontal', es: 'Sentadilla frontal', group: 'Cuádriceps', equipment: 'Barra', level: 'Avanzado', d: '1z6OEToCPUbjsUrZ3vfRsxZfR99jrzN-C' },
  { id: 'sentadilla-goblet', es: 'Sentadilla goblet', group: 'Cuádriceps', equipment: 'Mancuernas', level: 'Principiante', d: '1qGiO0eJ4-GSEpgjdws0KJW7n4NmNGt3o' },
  { id: 'sentadilla-hack', es: 'Sentadilla hack', group: 'Cuádriceps', equipment: 'Máquina', level: 'Intermedio', d: '10N18v24s7-YPj-x55NhlPi3R8WsjezIW' },
  { id: 'sentadilla-sumo', es: 'Sentadilla sumo', group: 'Cuádriceps', equipment: 'Mancuernas', level: 'Principiante', d: '1MYTQxGgnTP0TEf91lD9UCFcX1CHOGSq9' },
  { id: 'prensa-45', es: 'Prensa 45°', group: 'Cuádriceps', equipment: 'Máquina', level: 'Principiante', d: '1imGcPj51jVnGC5St7cXO2rbM5V295RV1' },
  { id: 'prensa-90', es: 'Prensa 90°', group: 'Cuádriceps', equipment: 'Máquina', level: 'Principiante', d: '1seDFemrPQiCnsvfDv9Jx6geNnqGUPsr3' },
  { id: 'extension-cuadriceps', es: 'Extensión de cuádriceps', group: 'Cuádriceps', equipment: 'Máquina', level: 'Principiante', d: '1EZMg-s7VjlKGfcrSFIBFboygGCb_61ik' },
  { id: 'zancadas', es: 'Zancadas estáticas', group: 'Cuádriceps', equipment: 'Mancuernas', level: 'Principiante', d: '1P87lzmzDgmwF3Yd1w8OJ9UxJmssVUlFq' },
  { id: 'step-up', es: 'Step up', group: 'Cuádriceps', equipment: 'Mancuernas', level: 'Principiante', d: '1ETY_5miiaCnTSS_tTj0-Fl8WGyZqtNJf' },
  { id: 'sentadilla-bulgara', es: 'Sentadilla búlgara', group: 'Cuádriceps', equipment: 'Mancuernas', level: 'Intermedio', d: '17D9vYhxlBktRm4OEWm3hp_C2TYFtm4Vv' },

  // ─── ISQUIOS ───
  { id: 'peso-muerto-rumano', es: 'Peso muerto rumano', group: 'Isquios', equipment: 'Barra', level: 'Intermedio', d: '1UYfvJFICT4vOwyy5VaK22bU7PaPqnqIJ' },
  { id: 'buenos-dias', es: 'Buenos días con barra', group: 'Isquios', equipment: 'Barra', level: 'Intermedio', d: '12nJX9oIwR46m-JbrBtwOPsf6b-qE_37E' },
  { id: 'curl-femoral-pie', es: 'Curl femoral de pie', group: 'Isquios', equipment: 'Máquina', level: 'Principiante', d: '1DCTPagVgxDvL_IMzz9QDdMKN5bz4WjUF' },
  { id: 'curl-femoral-acostado', es: 'Curl femoral acostado', group: 'Isquios', equipment: 'Máquina', level: 'Principiante', d: '1PsoytRb0EQ0c3kxYfV3yB9xaTTuw92eZ' },
  { id: 'curl-femoral-sentado', es: 'Curl femoral sentado', group: 'Isquios', equipment: 'Máquina', level: 'Principiante', d: '1Qt8YukDoVrPXuFZ8EIWgJc-szqc0_tBh' },
  { id: 'curl-nordico', es: 'Curl nórdico', group: 'Isquios', equipment: 'Peso corporal', level: 'Avanzado', d: '1R7zT7nJTf76oRaExexGItQ8Ocu8jwa-4' },
  { id: 'pull-through', es: 'Pull through en polea', group: 'Isquios', equipment: 'Polea', level: 'Principiante', d: '10w765IPm-croftZ-c8Ffa4v9xHA3Q4i3' },

  // ─── GLÚTEOS ───
  { id: 'hip-thrust', es: 'Hip thrust', group: 'Glúteos', equipment: 'Barra', level: 'Intermedio', d: '1FtA7t74mYOI8IVF5nzzU2ceogqjy21N_' },
  { id: 'hip-thrust-unilateral', es: 'Hip thrust unilateral', group: 'Glúteos', equipment: 'Peso corporal', level: 'Intermedio', d: '18U7w20nvyw5acHsEXdJhrODMmD01a1Sq' },
  { id: 'puente-gluteos', es: 'Puente de glúteos', group: 'Glúteos', equipment: 'Peso corporal', level: 'Principiante', d: '1tjOeOcyyfMXtXJq-psaiSEGCblsR9enr' },
  { id: 'patada-gluteos-polea', es: 'Patada de glúteos en polea', group: 'Glúteos', equipment: 'Polea', level: 'Principiante', d: '13soSnnTHFQ1sVaHSGppt6MGMd6v7VCs_' },
  { id: 'abduccion-banda', es: 'Abducción con banda', group: 'Glúteos', equipment: 'Peso corporal', level: 'Principiante', d: '1Gl0wX5vegPlWk0ux-DmQW1yo-pgAF_GJ' },
  { id: 'abduccion-maquina', es: 'Abducción de cadera en máquina', group: 'Glúteos', equipment: 'Máquina', level: 'Principiante', d: '1m2PsojtzILeNjVaH0nRDbndl0q1FbFyF' },
  { id: 'aduccion-maquina', es: 'Aducción en máquina', group: 'Glúteos', equipment: 'Máquina', level: 'Principiante', d: '1mkoLKAVqE28NTzPDbKHmng4vqA83lGYO' },
  { id: 'frogs-pumps', es: 'Frogs pumps con banda', group: 'Glúteos', equipment: 'Peso corporal', level: 'Principiante', d: '1qouRG8tYEUO1daIYDD06lSh_EHNnJmlF' },
  { id: 'peso-muerto-convencional', es: 'Peso muerto convencional', group: 'Glúteos', equipment: 'Barra', level: 'Avanzado', d: '1GgJ7px7C_vZogIKBBEp3_4hxCUFTfLOK' },
  { id: 'peso-muerto-sumo', es: 'Peso muerto sumo', group: 'Glúteos', equipment: 'Barra', level: 'Avanzado', d: '1N9ovpGcbGwhA5yue0P2P19daVJu4y8Gq' },
  { id: 'peso-muerto-unilateral', es: 'Peso muerto unilateral', group: 'Glúteos', equipment: 'Mancuernas', level: 'Intermedio', d: '1MyX3nmm7OJYPt_AauHSKU5qtoQpNrEfY' },

  // ─── GEMELOS ───
  { id: 'elevacion-talones', es: 'Elevación de talones de pie', group: 'Gemelos', equipment: 'Máquina', level: 'Principiante', d: '1dm2vyVF8-a3OUf1pTisEzInjOA4aU9zS' },
];

// English subtitles (best-effort) for catalog cards.
const EN_NAMES = {
  'press-banca-plano': 'Flat Bench Press', 'press-inclinado': 'Incline Bench Press', 'press-declinado': 'Decline Bench Press',
  'press-plano-mancuernas': 'Dumbbell Bench Press', 'aperturas-mancuernas': 'Dumbbell Flyes', 'aperturas-inclinadas': 'Incline Flyes',
  'cruces-polea-alta': 'High Cable Crossover', 'cruces-polea-media': 'Mid Cable Crossover', 'cruces-polea-baja': 'Low Cable Crossover',
  'peck-deck': 'Pec Deck', 'press-convergente': 'Converging Machine Press', 'fondos-pecho': 'Chest Dips',
  'flexiones': 'Push-ups', 'flexiones-inclinadas': 'Incline Push-ups',
  'dominadas': 'Pull-ups', 'dominadas-supinas': 'Chin-ups', 'dominadas-asistidas': 'Assisted Pull-ups',
  'remo-barra': 'Barbell Row', 'remo-hammer': 'Hammer Row', 'remo-maquina': 'Machine Row', 'remo-t': 'T-Bar Row',
  'remo-banco-inclinado': 'Chest-Supported Row', 'remo-invertido': 'Inverted Row',
  'jalon-pecho': 'Lat Pulldown', 'jalon-trasnuca': 'Behind-Neck Pulldown', 'jalon-cerrado': 'Close-Grip Pulldown', 'jalon-amplio': 'Wide-Grip Pulldown',
  'pull-over': 'Dumbbell Pullover',
  'press-militar-barra': 'Barbell Overhead Press', 'press-militar-mancuernas': 'Dumbbell Shoulder Press', 'press-arnold': 'Arnold Press',
  'press-hombros-maquina': 'Machine Shoulder Press', 'elevaciones-laterales': 'Lateral Raises', 'elevaciones-frontales': 'Front Raises',
  'elevacion-frontal-disco': 'Plate Front Raise', 'remo-menton': 'Upright Row', 'pajaros-mancuernas': 'Rear Delt Flyes',
  'pajaros-peck-deck': 'Reverse Pec Deck', 'face-pull-hombros': 'Face Pull', 'y-raise': 'Incline Y-Raise', 'encogimientos': 'Shrugs',
  'curl-barra-z': 'EZ-Bar Curl', 'curl-barra-recta': 'Straight Bar Curl', 'curl-21': '21s', 'curl-21-z': 'EZ-Bar 21s',
  'curl-alternado': 'Alternating Curl', 'curl-inclinado': 'Incline Curl', 'curl-martillo': 'Hammer Curl',
  'curl-martillo-mancuernas': 'DB Hammer Curl', 'curl-martillo-cuerda': 'Rope Hammer Curl', 'curl-concentrado': 'Concentration Curl',
  'curl-predicador': 'Preacher Curl', 'curl-polea-baja': 'Low Cable Curl', 'curl-unilateral-polea': 'Single-Arm Cable Curl', 'spider-curl': 'Spider Curl',
  'patada-triceps-polea': 'Cable Kickback', 'pres-frances-z': 'EZ-Bar Skullcrusher', 'pres-frances-mancuernas': 'DB Skullcrusher',
  'extension-triceps-mancuernas': 'Overhead Extension', 'extension-unilateral-polea': 'Single-Arm Pushdown',
  'extension-triceps-unilateral': 'Single-Arm Overhead Ext.', 'press-triceps-maquina': 'Machine Tricep Press', 'press-cerrado': 'Close-Grip Bench',
  'fondos-paralelas': 'Parallel Bar Dips',
  'sentadilla-libre': 'Back Squat', 'sentadilla-frontal': 'Front Squat', 'sentadilla-goblet': 'Goblet Squat', 'sentadilla-hack': 'Hack Squat',
  'sentadilla-sumo': 'Sumo Squat', 'prensa-45': 'Leg Press 45°', 'prensa-90': 'Leg Press 90°', 'extension-cuadriceps': 'Leg Extension',
  'zancadas': 'Static Lunges', 'step-up': 'Step Up', 'sentadilla-bulgara': 'Bulgarian Split Squat',
  'peso-muerto-rumano': 'Romanian Deadlift', 'buenos-dias': 'Good Mornings', 'curl-femoral-pie': 'Standing Leg Curl',
  'curl-femoral-acostado': 'Lying Leg Curl', 'curl-femoral-sentado': 'Seated Leg Curl', 'curl-nordico': 'Nordic Curl', 'pull-through': 'Cable Pull-Through',
  'hip-thrust': 'Hip Thrust', 'hip-thrust-unilateral': 'Single-Leg Hip Thrust', 'puente-gluteos': 'Glute Bridge',
  'patada-gluteos-polea': 'Cable Glute Kickback', 'abduccion-banda': 'Band Abduction', 'abduccion-maquina': 'Hip Abduction Machine',
  'aduccion-maquina': 'Hip Adduction Machine', 'frogs-pumps': 'Frog Pumps', 'peso-muerto-convencional': 'Conventional Deadlift',
  'peso-muerto-sumo': 'Sumo Deadlift', 'peso-muerto-unilateral': 'Single-Leg Deadlift', 'elevacion-talones': 'Standing Calf Raise',
};

// Enrich each entry with en name.
LIBRARY.forEach((e) => { e.en = EN_NAMES[e.id] || ''; e.img = driveImg(e.d); });

Object.assign(window, { LIBRARY, driveImg });
