import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useState } from 'react'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O clico precisa ser de no mínimo 5 minutos.')
    .max(60, 'O clico precisa ser de no máximo 60 minutos.'),
})

interface ICycle {
  id: string
  task: string
  minutesAmount: number
}

// Faz referÊncia da variável JavaScriot dentro do TypeScript.
type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  // Armazena a quantidade de segundos que já se passaram
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    // Deve-se passar o schema de validação.
    resolver: zodResolver(newCycleFormValidationSchema),
    // Define o valor inicial de cada campo.
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: INewCycleFormData) {
    const newCycle: ICycle = {
      id: crypto.randomUUID(),
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((oldState) => [...oldState, newCycle])
    // Seta no estado de activeCycleId o ID do ciclo que está ativo no momento
    setActiveCycleId(newCycle.id)

    // Reseta os campos do formulário para seu valor default.
    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Se tiver um ciclo ativo será convertido os minutos em segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  // Recebe o valor atual em tempo real dos segundos
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  // Converte o total de segundos em minutos para poder exibir os dados em tela
  // Math.floor é usado para quando a divisão der quebrada, arredondar para baixo/inteiro
  const minutesAmount = Math.floor(currentSeconds / 60)
  // Pega o resto de segudos que sobrou dos segundos atuais
  const secondsAmount = currentSeconds % 60

  /**
   * PadStart => Diz quantos caracteres uma string vai ter.
   * E se não tiver esse total, ele preenche no início da mesma o que dissermos
   */
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Observa se há mudanças na variável.
  const task = watch('task')

  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          {/* Lista de sugestões para um input */}
          <datalist id="task-suggestions">
            <option value="Project 1" />
            <option value="Project 2" />
            <option value="Project 3" />
            <option value="Project 4" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}

/**
 * Instalar a biblioteca @hookform/resolvers,
 * porque ela irá intregar o react-hook-form
 * com as bibliotecas de validação.
 */
