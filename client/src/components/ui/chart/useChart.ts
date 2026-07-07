import ChartContext from './chart-context';
import * as React from 'react';

function useChart() {
    const context = React.useContext(ChartContext);
    if (!context) {
        throw new Error('useChart must be used within a <ChartContainer />');
    }
    return context;
}

export default useChart;
