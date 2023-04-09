/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import ReactEChartsCore from 'echarts-for-react/lib/core'
import type EChartsReactCore from 'echarts-for-react/lib/core'

import { forwardRef } from 'react'
import { useMediaQuery } from '@react-hook/media-query'

import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import {
  GridComponent,
  DatasetComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'
import type {
  BarSeriesOption,
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts'

import type { RankerResults } from '..'

import styles from './Chart.module.css'

type ChartProps = { results: RankerResults }
type EChartOption = echarts.ComposeOption<(
  | BarSeriesOption
  | DatasetComponentOption
  | GridComponentOption
  | TitleComponentOption
  | TooltipComponentOption
)>

echarts.use([
  BarChart,
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  SVGRenderer
])

const Chart = forwardRef<EChartsReactCore, ChartProps>(
  function Chart ({ results }: ChartProps, ref): JSX.Element {
    const isLightTheme = useMediaQuery('(prefers-color-scheme: light)')

    const dataset = [
      ['Player', 'Elo'],
      ...results.players.map(player => [player.player!, player.elo])
    ]

    const option: EChartOption = {
      title: {
        text: results.name
      },
      dataset: {
        source: dataset
      },
      xAxis: {
        name: 'Players',
        type: 'category'
      },
      yAxis: {
        name: 'Ratings'
      },
      series: [
        { type: 'bar' }
      ],
      tooltip: {
        trigger: 'item'
      }
    }

    let theme = 'dark'
    if (isLightTheme) theme = 'light'

    return (
      <ReactEChartsCore
        echarts={echarts} option={option} theme={theme}
        className={styles.chart} ref={ref}
      />
    )
  })

export default Chart
