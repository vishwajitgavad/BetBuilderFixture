import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function MatchDetails() {
    const [marketList, setMarketList] = useState([]);
    const [legList, setLegList] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [selectedLeg, setSelectedLeg] = useState(null);
    const [bets, setBets] = useState([])
    const [team, setteam] = useState({})
    const { Match } = useParams()


    // console.log(team, "team");

    useEffect(() => {
        const fetchMatchInfo = async () => {
            const { data } = await axios.get(`http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1`)
            const selected = data.find(obj => obj.MatchId === Match);
            setteam(selected)
        };
        fetchMatchInfo();

    }, [team]);


    useEffect(() => {

        const fetchMarketList = async () => {
            const { data } = await axios.get('http://cms.bettorlogic.com/api/BetBuilder/GetMarkets?sports=1');
            setMarketList(data);
        };
        fetchMarketList()

    }, [])

    useEffect(() => {
        const getLegs = async () => {
            const { data } = await axios.get("http://cms.bettorlogic.com/api/BetBuilder/GetSelections?sports=1")
            setLegList(data)

        }
        getLegs()
    }, [])



    const handleMarketSelect = (market) => {
        setSelectedMarket(market);
    };

    const handleLegSelect = (leg) => {
        setSelectedLeg(leg);
    };




    useEffect(() => {
        const fetchBets = async () => {
            if (selectedMarket && selectedLeg) {
                const { data } = await axios.get(`http://cms.bettorlogic.com/api/BetBuilder/GetBetBuilderBets?sports=1&matchId=${Match}&marketId=${selectedMarket.MarketId}&legs=${selectedLeg.selectionId}&language=en`);
                setBets(data.BetBuilderSelections)
                console.log(data.BetBuilderSelections);

            }
        };
        fetchBets();

    }, [selectedMarket, selectedLeg]);

    const ConvertDate = (item) => {
        const dateTime = new Date(item);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[dateTime.getMonth()];
        const day = dateTime.getDate();
        const year = dateTime.getFullYear();
        const convertedDateTimeString = `${month} ${day}, ${year}`;
        return convertedDateTimeString;
    };

    return (
        <>
            <div class="card">
                <div class="card-body">
                    <button type="button" class="btn btn-danger">
                        <Link to="/" className='text-decoration-none text-light'>  <i class="bi bi-arrow-left"></i></Link>

                    </button>

                </div>
            </div>
            <div class="card">
                <div class="card-body bg-danger" >
                    <h1 className='text-light' >
                        Make It A Bet Builder
                    </h1>
                </div>
                <div class="card-body">
                </div>

                <nav class="navbar  navbar-expand-lg bg-dark text-light navbar-light sticky-top py-0 pe-5">
                    <div class="navbar-brand  ps-5 me-0">
                        <div class="text-center text-light" style={{ "margin-left": "85px" }}>
                            <strong>{ConvertDate(team?.MatchDate)}</strong>
                            <br />

                            <strong className='text-center '>{team?.MatchTime?.substring(0, 5)}</strong>
                        </div>
                    </div>

                    <div class="collapse navbar-collapse " id="navbarCollapse">
                        <div style={{ "margin-left": "300px" }}>
                            <h3 class="text-center" >{team?.Team1Name} VS {team?.Team2Name} </h3>
                            <h6 className='text-center'>{team?.LeagueName}</h6>
                        </div>
                    </div>
                </nav>


            </div>

            <div className='container mt-4'>


                <div>
                    <div class="btn-group">
                        <strong>Market List:</strong>
                        <select onChange={(e) => handleMarketSelect(marketList[e.target.selectedIndex])}>
                            {marketList.map((match, index) => (
                                <option key={index} value={index}>
                                    {match.MarketName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div class="btn-group ms-5 mt-2 ">
                        <strong> Ligs:</strong>
                        <select onChange={(e) => handleLegSelect(legList[e.target.selectedIndex])}>
                            {legList.map((leg, index) => (
                                <option key={index} value={index}>
                                    {leg.selectionId}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div >



            <div className="container mt-5">
                <h4>BetBuilder Bets Oods:</h4>
                <div className="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr className='alert alert-secondary text-danger'>

                                <th>Keys States</th>
                                <th >Market</th>
                                <th>Outcome</th>

                            </tr>
                        </thead>
                        <tbody>

                            {
                                bets.length > 0 && (

                                    bets.map((bet, index) => (<tr>
                                        <td>{bet.RTB}</td>
                                        <td>{bet.Market}</td>
                                        <td>{bet.Selection}</td>
                                    </tr>
                                    ))


                                )
                            }
                        </tbody>
                    </table>
                </div>

            </div>


        </>
    )
}
