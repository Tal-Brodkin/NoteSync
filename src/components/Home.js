import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <div className="jumbotron bg-light p-5 rounded">
                        <h1 className="display-4 mb-4">Welcome to NoteSync</h1>
                        <p className="lead mb-4">
                            NoteSync is your ultimate collaborative note-taking platform. 
                            Effortlessly create, edit, and share notes with your team in real-time. 
                            Stay organized and productive with our intuitive and easy-to-use interface.
                        </p>
                        <div className="mb-4">
                            <Link to="/login" className="btn btn-primary btn-lg d-block">LETS GO</Link>
                        </div>
                        <div className="mb-4">
                            <p className="mt-2 small">Don't have an account? Register <Link to="/register">here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;