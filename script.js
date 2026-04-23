const videoList = [
    '1.mp4',
    '2.mp4',
    '3.mp4',
    '4.mp4',
    '5.mp4'
];

const currentPlaying = { 'left-container': '', 'right-container': '' };

function setupVideoSwitch(containerId, videoId1, videoId2) {
    const v1 = document.getElementById(videoId1);
    const v2 = document.getElementById(videoId2);
    let currentVideo = v1;
    let nextVideo = v2;
    let isSwapping = false;

    function getUniqueSrc() {
        const otherId = containerId === 'left-container' ? 'right-container' : 'left-container';
        let newSrc;
        let attempts = 0;
        do {
            newSrc = videoList[Math.floor(Math.random() * videoList.length)];
            attempts++;
        } while ((newSrc === currentPlaying[containerId] || newSrc === currentPlaying[otherId]) && attempts < 50);
        return newSrc;
    }

    async function swap() {
        if (isSwapping) return;
        isSwapping = true;

        const newSrc = getUniqueSrc();
        currentPlaying[containerId] = newSrc;
        nextVideo.src = newSrc;

        try {
            nextVideo.load();
            await nextVideo.play();
            nextVideo.classList.add('active');
            currentVideo.classList.remove('active');
            setTimeout(() => {
                currentVideo.pause();
                currentVideo.src = "";
                [currentVideo, nextVideo] = [nextVideo, currentVideo];
                isSwapping = false;
            }, 1500);
        } catch (e) { isSwapping = false; }
    }

    const startSrc = getUniqueSrc();
    currentPlaying[containerId] = startSrc;
    v1.src = startSrc;
    v1.play().catch(() => {
        document.body.addEventListener('click', () => v1.play(), {once: true});
    });

    setInterval(swap, 10000);
}

window.onload = () => {
    setupVideoSwitch('left-container', 'v1-left', 'v2-left');
    setupVideoSwitch('right-container', 'v1-right', 'v2-right');
};
