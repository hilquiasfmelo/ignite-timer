import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
    amountSecondsPassed,
  } = useContext(CyclesContext)

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
          markCurrentCycleAsFinished()

          // Zera o contador em tela
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // Reseta os intervalos do clico em execução caso houver um novo a ser criado
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

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
