import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { CountdownContainer, Separator } from './styles'

interface ICountdownProps {
  activeCycle: any
  setCycles: any
  activeCycleId: any
}

export function Countdown({
  activeCycle,
  setCycles,
  activeCycleId,
}: ICountdownProps) {
  // Armazena a quantidade de segundos que já se passaram
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Se tiver um ciclo ativo será convertido os minutos em segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference =
          // Busca a diferença em segundos entre a data atual com a data de início do ciclo ativo
          differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                // Guarda a data que o ciclo acabou
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          // Zera o contador em tela
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // Reseta os intervalos do clico em execução caso houver um novo a ser criado
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
