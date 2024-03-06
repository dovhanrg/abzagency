import React, {FormEvent, MouseEventHandler, useEffect, useRef, useState} from 'react';

import './App.css';
import {getFetch, postFetch} from "./http/fetchImpl";

const IP_ADDR = process.env.IP_ADDR;
const API_PORT = process.env.API_PORT;
export const api_url = `https://${IP_ADDR}:${API_PORT}/api/v1/users?page=0&count=5`;
const initialLink = process.env.NODE_ENV === 'development' ? `/api/v1/users?page=0&count=5` : api_url;

type User = {
    position_id: number,
    position: string,
    id: number,
    name: string,
    email: string,
    phone: string,
    photo: string,
    created_at: string
};

function App() {
    const refModal = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<{ name: string, id: number }[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [remoteToken, setRemoteToken] = useState<string>();
    const [links, setLinks] = useState<{ prevLink: null | string, nextLink: null | string }>({
        prevLink: null,
        nextLink: initialLink
    });
    const [currentUsersRequest, setCurrentUsersRequest] = useState({
        page: 0,
        offset: 0,
        count: 5,
    });

    const fetchUsers = (link?: string | null) => {
        if (link) {
            getFetch<{
                success: boolean,
                page: number,
                total_users: number,
                total_pages: number,
                count: number,
                links: {
                    next_url: string | null,
                    prev_url: string | null,
                },
                users: User[],
            }>(link)
                .then(data => {
                    if (data.success) {
                        setUsers(data.users)
                        setLinks({
                            nextLink: data.links.next_url,
                            prevLink: data.links.prev_url,
                        });
                    }
                });
        }
    }

    useEffect(() => {
      fetchUsers(links.nextLink);
    }, []);

    useEffect(() => {
        window.onclick = function (event) {
            if (refModal.current && event.target == refModal.current) {
                refModal.current.style.display = "none";
            }
        }
        getFetch<{
            success: boolean;
            positions: { name: string, id: number }[];
        }>('/api/v1/positions').then((data) => data.success && setPositions(data.positions));
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

        if (!remoteToken) {
            await getFetch<{ success: boolean; token: string }>('/api/v1/token')
                .then((result) => {
                    if (result.success) {
                        setRemoteToken(result.token);
                        return result.token;
                    }
                }).then((freshToken) => {
                    if (freshToken) {
                        registerUser(formData, freshToken);
                    }
                });
        }
    }

    const onNextClick = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        fetchUsers(links.nextLink);
    }

    const onPrevClick = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        fetchUsers(links.prevLink);
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
            <div className="container">
                <div>
                    <a href={links.prevLink ?? undefined} onClick={onPrevClick}>Prev</a>
                </div>
                <div className="usersContainer">
                    {users.map((user) => {
                        return (<div className="userWrapper">
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phone}</p>
                            <p>Position: {user.position}</p>
                            <p>
                                <img src={user.photo} alt="photo"/>
                            </p>
                        </div>);
                    })}
                </div>
                <div>
                    <a href={links.nextLink ?? undefined} onClick={onNextClick}>Next</a>
                </div>
            </div>
        </div>
    );
}

export default App;
