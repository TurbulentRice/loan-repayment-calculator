// Receives info Object in form {title: value}
// Divide card into columns, format
// Benefit of having its own component is reduce clutter in parent component
const InfoCard = ({ info }) => {
  return (
    <div className="row d-flex justify-content-between">
      {Object.entries(info).map(([key, value], index) => <p key={index}>{key}: {value}</p>)}
    </div>
  )
}

export default InfoCard;