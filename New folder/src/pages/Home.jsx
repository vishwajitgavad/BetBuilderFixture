
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [dateList, setDateList] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [months] = useState(['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);

    useEffect(() => {
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            dates.push(date.toDateString());
        }
        setSelectedDate(
            `${months.indexOf(dates[0].split(' ')[1]) + 1}/${dates[0].split(' ')[2]}/${dates[0].split(' ')[3]}`
        );
        setDateList(dates);
    }, []);

    useEffect(() => {
        const getFixtures = async () => {
            try {
                const { data } = await axios.get('http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1');
                console.log(data, "my");
                const processData = data.filter((item) => item.MatchDate.split(' ')[0] === selectedDate);
                // const processData = data.filter((item) => item.MatchId === "7/1/2023 12:00:00 AM");
                console.log(processData);
                setFixtures(processData);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        getFixtures();
    }, [selectedDate]);

    let previousCountry = '';

    return (
        <div className='container'>

            {/* <div className="text-center">
                {dateList.map((date, index) => (
                    <button
                        onClick={() => {
                            let day = date.split(' ')[2]
                            if (day < 10) {
                                day = day.toString().split("")[1]
                                console.log(day);
                            }

                            setSelectedDate(
                                `${months.indexOf(date.split(' ')[1]) + 1}/${day}/${date.split(' ')[3]}`
                            );

                        }}
                        // className="alert alert-secondary rounded"
                        className={`alert ${selectedDate === date ? 'alert-danger' : 'alert-secondary'} rounded`}
                        key={index}
                    >
                        {date}
                    </button>
                ))}
            </div> */}
            <div className="text-center">
                {dateList.map((date, index) => {
                    let day = date.split(' ')[2];
                    if (day < 10) {
                        day = day.toString().split('')[1];
                    }

                    const formattedDate = `${months.indexOf(date.split(' ')[1]) + 1}/${day}/${date.split(' ')[3]}`;

                    return (
                        <button
                            onClick={() => setSelectedDate(formattedDate)}
                            className={`btn ${selectedDate === formattedDate ? 'btn-danger' : 'btn-secondary'} rounded`}
                            key={index}
                        >
                            {date}
                        </button>
                    );
                })}
            </div>

            {loading && (
                <div className="preloader-container">
                    <div className="preloader"></div>
                </div>
            )}

            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-6 offset-3">
                        <div>
                            <strong>⚽ Football</strong>
                        </div>

                        <div className="card text-center mt-3">
                            {fixtures.map((match) => {
                                const countryCell =
                                    match.Country === previousCountry ? null : (
                                        <div className="card-header mt-4 bg-danger text-light">{match.LeagueName}</div>
                                    );
                                previousCountry = match.Country;
                                return (
                                    <>

                                        {countryCell}
                                        <div className="light-silver card-body">
                                            <div>
                                                <Link to={`/match-details/${match?.MatchId}`} className="text-decoration-none text-dark">
                                                    {match?.Team1Name} {match?.MatchTime?.substring(0, 5)} {match?.Team2Name}
                                                </Link>
                                            </div>
                                            <hr />
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

