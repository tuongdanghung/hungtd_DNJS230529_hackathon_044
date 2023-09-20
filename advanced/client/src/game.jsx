import React, { useEffect, useState } from "react";
import axios from "axios";

const GameComponent = () => {
    const [dataDetail, setDataDetail] = useState({});
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [name3, setName3] = useState("");
    const [name4, setName4] = useState("");
    const [count, setCount] = useState(null);
    const [isCheck, setIsCheck] = useState(false);
    useEffect(() => {
        axios
            .get(`http://localhost:2000/api/game/${count}`)
            .then((response) => {
                setDataDetail(response.data.data);
            });
    }, [count, isCheck]);

    const handleAddUser = () => {
        axios
            .post("http://localhost:2000/api/game/create", {
                name1,
                name2,
                name3,
                name4,
            })
            .then((response) => {
                setCount(response.data.count);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };
    const transformedData = dataDetail?.player?.reduce((result, player) => {
        player.row.forEach((row, index) => {
            const rowKey = `row${index + 1}`;
            result[rowKey] = result[rowKey] || [];
            result[rowKey].push({
                idRow: row.idRow,
                points: row.points,
                idPlayer: player.idPlayer,
                name: player.name,
            });
        });
        return result;
    }, {});
    const handleChange = (cell) => {
        axios
            .put(
                `http://localhost:2000/api/game/${count}/players/${cell.idPlayer}/rows/${cell.idRow}`,
                {
                    points: 1,
                }
            )
            .then((response) => {
                setIsCheck(!isCheck);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const handleAddRow = () => {
        axios
            .put(`http://localhost:2000/api/game/${count}`, {
                newRows: 1,
            })
            .then((response) => {
                setIsCheck(!isCheck);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };
    return (
        <div>
            <div className="add-user">
                <div>
                    <label>Name 1</label>
                    <input
                        type="text"
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                    />
                </div>
                <div>
                    <label>Name 2</label>
                    <input
                        type="text"
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                    />
                </div>
                <div>
                    <label>Name 3</label>
                    <input
                        type="text"
                        value={name3}
                        onChange={(e) => setName3(e.target.value)}
                    />
                </div>
                <div>
                    <label>Name 4</label>
                    <input
                        type="text"
                        value={name4}
                        onChange={(e) => setName4(e.target.value)}
                    />
                </div>
                <button onClick={handleAddUser}>Add user</button>
            </div>
            <div className="round">
                <table>
                    <thead>
                        <tr>
                            <th># </th>
                            {dataDetail?.player?.map((item, index) => {
                                return <th key={index}>{item.name}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sum point</td>
                            <td>10</td>
                            <td>20</td>
                            <td>30</td>
                            <td>40</td>
                        </tr>
                        {Object.keys(
                            transformedData !== undefined && transformedData
                        ).map((rowKey, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>Round: {rowIndex + 1}</td>
                                {transformedData[rowKey].map(
                                    (cell, cellIndex) => (
                                        <td key={cellIndex}>
                                            <input
                                                onChange={() =>
                                                    handleChange(cell)
                                                }
                                                type="number"
                                            />
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                        {/* <tr></tr> */}
                    </tbody>
                </table>
                <button onClick={handleAddRow}>add round</button>
            </div>
        </div>
    );
};

export default GameComponent;
