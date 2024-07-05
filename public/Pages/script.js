document.addEventListener('DOMContentLoaded', function() {
    const addFileBtn = document.getElementById('addFileBtn');
    const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));
    const uploadBtn = document.getElementById('uploadBtn');
    const fileList = document.getElementById('fileList');

    function fetchPosts() {
        axios.get('https://farmapi.selfmade.one/api/posts', {
            headers: {
                'Authorization': `Bearer 75|FC1CMxpHbqC75nHxj04EWTXB0B3NJcP7m0jKOa5X4376bf08`
            }
        })
        .then(function (response) {
            console.log('Fetched posts:', response.data);
            fileList.innerHTML = '';
            if (Array.isArray(response.data)) {
                response.data.forEach(post => addPostToList(post));
            } else {
                console.error('Expected an array of posts, got:', response.data);
            }
        })
        .catch(function (error) {
            console.error('Error fetching posts:', error.response ? error.response.data : error.message);
        });
    }

    function addPostToList(post) {
        console.log('Adding post to list:', post);
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        
        const fileName = post.file_path ? post.file_path.split('/').pop() : 'Unknown file';
        const description = post.description || 'No description';
        
        let imageHtml = '';
        if (post.file_path) {
            const imageUrl = `https://farmapi.selfmade.one/storage/${post.file_path}`;
            imageHtml = `<img src="${imageUrl}" alt="Uploaded file" style="max-width: 200px; max-height: 200px; object-fit: contain;">`;
        }

        listItem.innerHTML = `
            ${imageHtml}
            <p><strong>File:</strong> ${fileName}</p>
            <p><strong>Description:</strong> ${description}</p>
        `;
        fileList.appendChild(listItem);
    }

    fetchPosts();

    addFileBtn.addEventListener('click', function() {
        uploadModal.show();
    });

    uploadBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const descriptionInput = document.getElementById('descriptionInput');

        if (fileInput.files.length > 0 && descriptionInput.value.trim() !== '') {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('description', descriptionInput.value.trim());

            axios.post('https://farmapi.selfmade.one/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer 75|FC1CMxpHbqC75nHxj04EWTXB0B3NJcP7m0jKOa5X4376bf08`
                }
            })
            .then(function (response) {
                console.log('Upload response:', response.data);
                if (response.data.post) {
                    addPostToList(response.data.post);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
                uploadModal.hide();
                document.getElementById('uploadForm').reset();
            })
            .catch(function (error) {
                console.error('Error uploading file:', error.response ? error.response.data : error.message);
                alert('An error occurred while uploading the file. Please check the console for details.');
            });
        } else {
            alert('Please select a file and provide a description.');
        }
    });
});