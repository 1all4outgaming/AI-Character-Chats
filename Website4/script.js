let peerConnection;
const fileInput = document.getElementById('fileInput');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');
const linkContainer = document.getElementById('linkContainer');
const shareLink = document.getElementById('shareLink');
const downloadSection = document.getElementById('downloadSection');
const downloadLink = document.getElementById('downloadLink');

sendBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }
    createOffer(file);
});

function createOffer(file) {
    peerConnection = new RTCPeerConnection();

    // Create data channel
    const dataChannel = peerConnection.createDataChannel('fileTransfer');
    dataChannel.onopen = () => console.log('Data channel open');
    dataChannel.onclose = () => console.log('Data channel closed');

    dataChannel.onmessage = event => {
        // Receiver will trigger download when data is received
        const receivedBlob = new Blob([event.data]);
        downloadLink.href = URL.createObjectURL(receivedBlob);
        downloadLink.download = file.name;
        downloadSection.classList.remove('hidden');
        status.textContent = 'File received!';
    };

    // Create offer
    peerConnection.createOffer()
        .then(offer => {
            peerConnection.setLocalDescription(offer);
            const offerLink = window.location.href + '?offer=' + btoa(offer.sdp);
            shareLink.value = offerLink;
            linkContainer.classList.remove('hidden');
            status.textContent = 'Waiting for peer to connect...';
        });

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log('ICE candidate:', event.candidate);
        }
    };
}

function handleAnswer(answerSdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: answerSdp
    }));
    status.textContent = 'Connected! File transfer will begin.';
}

function connectPeer(offerSdp) {
    peerConnection = new RTCPeerConnection();

    // Create data channel
    peerConnection.ondatachannel = event => {
        const dataChannel = event.channel;

        dataChannel.onmessage = event => {
            const receivedBlob = new Blob([event.data]);
            downloadLink.href = URL.createObjectURL(receivedBlob);
            downloadLink.download = 'received_file';
            downloadSection.classList.remove('hidden');
            status.textContent = 'File received!';
        };
    };

    peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: offerSdp
    }));

    peerConnection.createAnswer()
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            const answerLink = window.location.href + '?answer=' + btoa(peerConnection.localDescription.sdp);
            shareLink.value = answerLink;
            linkContainer.classList.remove('hidden');
        });

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log('ICE candidate:', event.candidate);
        }
    };
}

// Check if there's a query parameter (offer or answer) and handle accordingly
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('offer')) {
    const offerSdp = atob(urlParams.get('offer'));
    connectPeer(offerSdp);
}
if (urlParams.has('answer')) {
    const answerSdp = atob(urlParams.get('answer'));
    handleAnswer(answerSdp);
}
