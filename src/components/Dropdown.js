
const Dropdown = ({ selectedValue, setSelectedValue, setUrl }) => {
    const urlOptions = {
        '...': '...',
        'nse gsec': 'https://test-7agc.onrender.com/get-nse-gsec-data/',
        'nse corp bonds': 'http://130.61.177.8:8009/get-nse-corp-bond-data/',
        'nse sgb': 'http://130.61.177.8:8009/get-nse-sgb-data/',
        'bse gsec': 'http://130.61.177.8:8009/get-bse-gsec-data/',
        'bse corp bonds': 'http://130.61.177.8:8009/get-bse-corp-bond-data/',
        'bse sgb': 'http://130.61.177.8:8009/get-bse-sgb-data/',
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
