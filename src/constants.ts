import type { QuestionKey } from './types/survey'

export const QUESTIONS: ReadonlyArray<{ key: QuestionKey; label: string }> = [
  {
    key: 'q1',
    label:
      '¿Qué tan satisfecho se encuentra en general, con el servicio que recibe del Estudio Rodríguez Angobaldo?',
  },
  {
    key: 'q2',
    label:
      '¿Cómo calificaría la comunicación y la capacidad de respuesta que brindan los miembros del Estudio Rodríguez Angobaldo?',
  },
  {
    key: 'q3',
    label:
      '¿Qué nivel de cumplimiento considera que hemos alcanzado respecto a los objetivos del servicio contratado?',
  },
  {
    key: 'q4',
    label:
      'Si compara nuestros servicios con otros estudios de abogados, ¿cómo calificaría a nuestra organización en términos de competencia y diferenciación?',
  },
  {
    key: 'q5',
    label:
      '¿A qué nivel considera que el Estudio Rodríguez Angobaldo brinda valor agregado al servicio brindado?',
  },
  {
    key: 'q6',
    label:
      '¿El Estudio Rodríguez Angobaldo lo mantiene informado de los servicios que desarrolla de manera periódica?',
  },
  {
    key: 'q7',
    label:
      'En función de su experiencia, ¿qué tan probable es que recomiende el Estudio Rodríguez Angobaldo a un colega o conocido y que vuelva a contratar sus servicios en el futuro?',
  },
]

export const QUESTION_LABEL: Readonly<Record<QuestionKey, string>> = Object.fromEntries(
  QUESTIONS.map((q) => [q.key, q.label])
) as Record<QuestionKey, string>

export const QUESTION_ORDER: ReadonlyArray<QuestionKey> = QUESTIONS.map((q) => q.key)
