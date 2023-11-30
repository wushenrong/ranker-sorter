import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  // VictoryContainer,
  VictoryLabel,
  VictoryLegend,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from 'victory'
import { type Results } from './Result'

const chartProps = {
  theme: VictoryTheme.material,
  domainPadding: 20,
}

const horizontalAxisProps = {
  label: 'Characters',
  style: {
    axisLabel: {
      fontSize: 14,
      padding: 25,
    },
    tickLabels: {
      padding: 5,
    },
  },
}

const verticalAxisProps = {
  style: {
    axisLabel: {
      fontSize: 14,
      padding: 35,
    },
    tickLabels: {
      padding: 5,
    },
  },
}

const chartTitleLabelProps = {
  x: 10,
  y: 25,
  style: {
    fontSize: 20,
  },
}

const stackColorScale = [
  '#DCE775',
  '#FFF59D',
  '#F4511E',
  '#8BC34A',
  '#00796B',
  '#006064',
]

const chartStatisticsKeys = ['wins', 'draws', 'losses']

function Charts({ data }: { data: Results }) {
  const ratingsTitle = `${data.title} Ratings Chart`
  const statisticsTitle = `${data.title} Statistics Chart`

  return (
    <div className='charts'>
      <VictoryChart
        title={ratingsTitle}
        {...chartProps}
        /* containerComponent={
      <VictoryContainer
        containerRef={(ref) => {setChartRef(ref)}}
      />
    } */
      >
        <VictoryLabel {...chartTitleLabelProps} text={ratingsTitle} />
        <VictoryBar
          data={data.players}
          x='player'
          y='elo'
          labelComponent={<VictoryTooltip />}
          labels={({ datum }: { datum: { elo: number } }) =>
            `Elo: ${datum.elo}`
          }
        />
        <VictoryAxis {...horizontalAxisProps} />
        <VictoryAxis dependentAxis label='Elo' {...verticalAxisProps} />
      </VictoryChart>

      <VictoryChart title={statisticsTitle} {...chartProps}>
        <VictoryLabel {...chartTitleLabelProps} text={statisticsTitle} />
        <VictoryLegend
          orientation='horizontal'
          x={5}
          y={30}
          data={chartStatisticsKeys.map((key) => ({ name: key }))}
        />
        <VictoryStack colorScale={stackColorScale}>
          {chartStatisticsKeys.map((key, i) => {
            return (
              <VictoryBar
                data={data.players}
                x='player'
                y={key}
                key={i}
                labelComponent={<VictoryTooltip />}
                labels={({ datum }: { datum: Record<string, number> }) =>
                  `${datum[key]} ${key}`
                }
              />
            )
          })}
        </VictoryStack>
        <VictoryAxis
          tickFormat={data.players.map((player) => player.player)}
          {...horizontalAxisProps}
        />
        <VictoryAxis dependentAxis label='Comparisons' {...verticalAxisProps} />
      </VictoryChart>
    </div>
  )
}

export default Charts
