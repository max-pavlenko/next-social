
const UsernameMessage = ({loading, isValid, username}: { loading: boolean, isValid: boolean, username: string }) => {

    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className = 'text-success'>{username} is available!</p>
    } else if (!isValid && username) {
        return <p className = 'text-danger'>{username} is already taken or invalid!</p>
    } else {
        return <p style={{margin: '0 0 20px'}}>Please, enter your nickname</p>
    }
};

export default UsernameMessage;
