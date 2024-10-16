let peerConnection;
let dataChannel;
let fileReader;
const CHUNK_SIZE = 16384;

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

    // Create data channel for file transfer
    dataChannel = peerConnection.createDataChannel('fileTransfer');
    dataChannel.binaryType = 'arraybuffer';

    dataChannel.onopen = () => {
        console.log('Data channel open');
        sendFile(file);
    };

    dataChannel.onclose = () => console.log('Data channel closed');

    // Create offer
    peerConnection.createOffer().then(offer => {
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

function sendFile(file) {
    status.textContent = 'Sending file...';
    fileReader = new FileReader();
    let offset = 0;

    fileReader.onload = e => {
        dataChannel.send(e.target.result);
        offset += e.target.result.byteLength;
        if (offset < file.size) {
            readSlice(offset);
        } else {
            dataChannel.close();
            status.textContent = 'File sent successfully!';
        }
    };

    readSlice(0);

    function readSlice(o) {
        const slice = file.slice(o, o + CHUNK_SIZE);
        fileReader.readAsArrayBuffer(slice);
    }
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

    // Handle data channel when it's opened by the peer
    peerConnection.ondatachannel = event => {
        dataChannel = event.channel;
        const receivedChunks = [];
        
        dataChannel.onmessage = event => {
            receivedChunks.push(event.data);
        };

        dataChannel.onclose = () => {
            const receivedBlob = new Blob(receivedChunks);
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
