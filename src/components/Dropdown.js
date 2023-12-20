
const Dropdown = ({ selectedValue, setSelectedValue, setUrl }) => {
    const urlOptions = {
        '...': '...',
        'nse gsec': 'https://test-7agc.onrender.com/get-nse-gsec-data/',
        'nse corp bonds': 'https://test-7agc.onrender.com/get-nse-corp-bond-data/',
        'nse sgb': 'https://test-7agc.onrender.com/get-nse-sgb-data/',
        'bse gsec': 'https://test-7agc.onrender.com/get-bse-gsec-data/',
        'bse corp bonds': 'https://test-7agc.onrender.com/get-bse-corp-bond-data/',
        'bse sgb': 'https://test-7agc.onrender.com/get-bse-sgb-data/',
    };


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setUrl(urlOptions[event.target.value]);
    };

    return (
        <select value={selectedValue} onChange={handleChange} >
            {Object.keys(urlOptions).map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;