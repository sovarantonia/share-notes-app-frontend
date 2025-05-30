import axios from 'axios';
import qs from 'qs';

//const API_URL = 'http://localhost:8080';
const API_URL = 'https://share-notes-app-enwh.onrender.com'

// Axios instance to automatically attach Authorization header if token is present
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add the JWT token to the Authorization header on each request
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('tokenValue');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Login API call
export const login = async (email, password) => {
    try {
        const response = await api.post('/login', {email, password});

        const {data} = response;
        return data;

    } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Login failed');
        }
        throw new Error('Login failed');
    }
};

// Register API call
export const register = async (firstName, lastName, email, password) => {
    try {
        const response = await api.post('/register', {firstName, lastName, email, password});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Registration failed');
        }
    }
};

export const note = async (userId, title, text, date, grade, tags) => {
    try {
        const response = await api.post('/notes', {userId, title, text, date, grade, tags});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed creating a note');
        }
    }
}

export const getTagsByUser = async () => {
    try {
        const response = await api.get('/tags');
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the tags');
        }
    }
}

export const updateUserCredentials = async (userId, firstName, lastName) => {
    try {
        const response = await api.patch(`user/${userId}`, {firstName, lastName});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed updating credentials');
        }
    }
}

export const deleteAccount = async (userId) => {
    try {
        const response = await api.delete(`user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed deleting account');
        }
    }
}

export const viewAllNotesByUser = async () => {
    try {
        const response = await api.get('/notes');
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving notes');
        }
    }
}

export const getNoteById = async (noteId) => {
    try {
        const response = await api.get(`/notes/${noteId}`);
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the note');
        }
    }
}

export const searchNotes = async (title, tag, grade, from, to) => {
    try {
        const response = await api.get('/notes/search', {
            params: {
                title: title,
                tag: tag,
                grade: grade,
                from: from,
                to: to,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the notes');
        }
    }
}

export const deleteNote = async (noteId) => {
    try {
        const response = await api.delete(`/notes/${noteId}`);
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed deleting the note');
        }
    }
}

export const updateNote = async (noteId, userId, title, text, date, grade, tags) => {
    try {
        const response = await api.patch(`/notes/${noteId}`, {userId, title, text, grade, date, tags});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed updating the note');
        }
    }
}

export const downloadNote = async (selectedNotesIds, fileType) => {
    try {
        const response = await api.get(`/notes/download`, {
            params: {type: fileType, ids: selectedNotesIds},
            responseType: 'blob',
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
        });

        const blob = new Blob([response.data], {type: response.headers['content-type']});
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const disposition = response.headers['content-disposition'];
        const match = disposition && disposition.match(/filename="(.+)"/);
        link.download = match?.[1] || 'downloaded-note';
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed downloading the note');
        }
    }
}

export const latestNotes = async () => {
    try {
        const response = await api.get('/notes/latest');
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the notes');
        }
    }
}

export const getNotesBetweenDates = async (startDate, endDate) => {
    try {
        const response = await api.get('/notes/dates', {params: {startDate: startDate, endDate: endDate}});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the notes');
        }
    }
}

export const sendRequest = async (senderId, receiverEmail) => {
    try {
        const response = await api.post('/requests', {senderId, receiverEmail});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed sending the request');
        }
    }
}

export const getReceivedRequests = async () => {
    try {
        const response = await api.get('/requests/received');
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the requests');
        }
    }
}

export const getSentRequests = async () => {
    try {
        const response = await api.get('/requests/sent');
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the requests');
        }
    }
}

export const acceptRequest = async (requestId) => {
    try {
        const response = await api.patch(`/requests/${requestId}/accept`);
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed accepting the request');
        }
    }
}

export const declineRequest = async (requestId) => {
    try {
        const response = await api.patch(`/requests/${requestId}/decline`);
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed declining the request');
        }
    }
}

export const getUserFriends = async () => {
    try {
        const response = await api.get('/user/friends');
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed getting friend list');
        }
    }
}

export const removeFriend = async (friendId) => {
    try {
        const response = await api.delete(`/requests/remove-friend/${friendId}`)
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed removing friend');
        }
    }
}

export const searchUsers = async (searchString) => {
    try {
        const response = await api.get('/user/search', {params: {searchString: searchString}});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the users');
        }
    }
}

export const searchUserFriends = async (searchString) => {
    try {
        const response = await api.get('/user/friends/search', {params: {searchString: searchString}});
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving user friends');
        }
    }
}

export const shareNote = async (noteId, receiverEmail) => {
    try {
        const response = await api.post(`/share/${noteId}`, receiverEmail, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed sharing note');
        }
    }
}

export const getShareById = async (noteId) => {
    try {
        const response = await api.get(`/share/${noteId}`)
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the share');
        }
    }
}

export const getSentSharedNotes = async (receiverEmail) => {
    try {
        const response = await api.get('/share/sent', {
            params: {receiverEmail: receiverEmail},
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the shares');
        }
    }
}

export const getReceivedSharedNotes = async (senderEmail) => {
    try {
        const response = await api.get('/share/received', {
            params: {senderEmail: senderEmail},
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the shares');
        }
    }
}

export const getUsersNotFiendsWith = async (searchString) => {
    try {
        const response = await api.get('/user/non-friends', {params: {searchString: searchString}})
        return response.data;
    }catch (error) {
        console.error('Error response:', error);
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        } else {
            throw new Error('Failed retrieving the users');
        }
    }
}
