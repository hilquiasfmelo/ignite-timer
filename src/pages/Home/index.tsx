import { useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function handleCreateNewCycle(data: INewCycleFormData) {
    const newCycle: ICycle = {
      id: crypto.randomUUID(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((oldState) => [...oldState, newCycle])
    // Seta no estado de activeCycleId o ID do ciclo que está ativo no momento
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)

    // Reseta os campos do formulário para seu valor default.
    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

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

  // Mostra os minutos e segundos no título da aba do navegador
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  // Observa se há mudanças na variável.
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />

        <Countdown
          activeCycle={activeCycle}
          setCycles={setCycles}
          activeCycleId={activeCycleId}
        />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}

/**
 * Instalar a biblioteca @hookform/resolvers,
 * porque ela irá intregar o react-hook-form
 * com as bibliotecas de validação.
 */
