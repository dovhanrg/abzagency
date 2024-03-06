import React, {FormEvent, useEffect, useRef, useState} from 'react';

import './App.css';
import {getFetch, postFetch} from "./http/fetchImpl";

type User = {
    position_id: number,
    position: string,
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    image_file_name: string,
    created_at: string
};

function App() {
    const refModal = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<{ name: string, id: number }[]>([]);
    const [users, setUsers] = useState<User[]>();
    const [token, setToken] = useState<string>();
    // const [formData, setFormData] = useState<FormData>();

    useEffect(() => {
        window.onclick = function (event) {
            if (refModal.current && event.target == refModal.current) {
                refModal.current.style.display = "none";
            }
        }
        getFetch<{
            success: boolean,
            positions: { name: string, id: number }[]
        }>('/api/v1/positions').then((data) => data.success && setPositions(data.positions))
    }, []);

    const registerUser = async (formData: FormData, token: string) => {

        await postFetch<{
            success: boolean,
            users: User[],
            issues?: string[],
        }>('/api/v1/users', {token}, formData)
            .then(data => {
                if (!data.success) {
                    if (data.issues) {
                        alert([data.message, ...data.issues].join('. '));
                    } else if (data.message) {
                        alert(data.message);
                    }
                } else {
                    if (refModal.current) {
                        refModal.current.style.display = "none";
                    }
                }
            });
    }

    const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        console.log(token, formData);

        if (!token) {
            const result = await getFetch<{ success: boolean; token: string }>('/api/v1/token')
                .then((result) => {
                    if (result.success) {
                        setToken(result.token);
                        return result.token;
                    }
                }).then((freshToken) => {
                    console.log(token, freshToken);
                    if (freshToken) {
                        registerUser(formData, freshToken);
                    }
                });
            console.log(result, token);

        }
    }

    return (
        <div className="App">
            <button id="register" onClick={() => {
                if (refModal.current) {
                    refModal.current.style.display = 'block';
                }
            }}>Register
            </button>

            <div id="myModal" className="modal" ref={refModal}>

                <div className="modal-content">
                    <span className="close" onClick={() => {
                        if (refModal.current) {
                            refModal.current.style.display = 'none';
                        }
                    }}>&times;</span>
                    <div>
                        <form id="form" encType="multipart/form-data" onSubmit={onFormSubmit}>
                            <label htmlFor="name">Name</label>
                            <p>
                                <input type="text" name="name"/>
                            </p>
                            <label htmlFor="password">Password</label>
                            <p>
                                <input type="password" name="password"/>
                            </p>
                            <label htmlFor="email">Email</label>
                            <p>
                                <input type="text" name="email"/>
                            </p>
                            <label htmlFor="phone">Phone (format +380970001010)</label>
                            <p>
                                <input type="text" name="phone" placeholder="+380970001010"/>
                            </p>
                            <label htmlFor="photo">Photo</label>
                            <p>
                                <input type="file" name="photo" accept="image/jpeg"
                                       placeholder="Select photo ..."/>
                            </p>
                            <p>
                                <label htmlFor="position_id">Position</label>
                                <select name="position_id">
                                    {positions.map(position => {
                                        return (<option value={position.id} label={position.name}/>);
                                    })}
                                </select>
                            </p>
                            <p>
                                <input type="submit" value="submit"/>
                            </p>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
