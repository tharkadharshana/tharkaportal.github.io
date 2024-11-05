// Helper function to get query parameters from the URL
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        ap_mac: urlParams.get('ap'),
        mac: urlParams.get('id')
    };
}

// Function to authorize guest device
async function authorizeGuest() {
    const { ap_mac, mac } = getQueryParams();
    const upLimit = document.getElementById('upLimit').value || "";
    const downLimit = document.getElementById('downLimit').value || "";
    const bytesLimit = document.getElementById('bytesLimit').value || "";
    const minutes = document.getElementById('minutesLimit').value || 60; // default to 60 minutes if not set

    const authData = {
        cmd: "authorize-guest",
        mac: mac,
        minutes: minutes,
        ap_mac: ap_mac,
        up: upLimit,
        down: downLimit,
        bytes: bytesLimit
    };

    try {
        const response = await fetch('https://44.212.19.149:8443/api/s/default/cmd/stamgr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData),
            credentials: 'include' // Ensure cookies from login are used
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Authorization successful:', result);
            document.getElementById('actionBox').textContent = 'User authorized to get online!';
        } else {
            console.error('Authorization failed');
        }
    } catch (error) {
        console.error('Error authorizing:', error);
    }
}

// Set up event listener for the "Get Online" button
document.getElementById('getOnlineBtn').addEventListener('click', authorizeGuest);

// Display the extracted parameters in the "URL Parameters" box for reference
window.addEventListener('load', () => {
    const { ap_mac, mac } = getQueryParams();
    document.getElementById('responseBox').textContent = `AP MAC: ${ap_mac}, User MAC: ${mac}`;
});
