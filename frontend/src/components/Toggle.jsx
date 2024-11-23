import "./Toggle.css";

 const Toggle = ({handleChange,isChecked})=>{

    return (
<div className="toggle-container">
        <input type="checkbox" id="check" className="toggle" on change={handleChange} checked={isChecked}/>
        <label htmlFor="check" ></label>



</div>

    )





}
export default Toggle;