import Plot from 'react-plotly.js';

// Class for plotting Loan data
// Wrapper for plotly Plot component, taking only trace data and plotting
// Defines the basic settings we want to use with plotly
// (themes, styles, dimensions, etc)

// ********************
// Consider adding Tool functionality as Child here:
// LinePlot could receive Loan/Queue object and hold branches in state,
// which are manipulated via tools and updated in state
// This way, the data and visualization are close together in the program,
// reducing need for lifting state/ cross-component communication.
// ********************
const LinePlot = ({ plotData }) => {

  return (
    <Plot data={plotData}/>
  )
}

export default LinePlot;