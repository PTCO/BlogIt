import { router } from 'expo-router';
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';
import * as validator from 'validator';
import moment from 'moment'

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.ptco.aora",
    projectId: "66fec8b0003d3b732bd4",
    databaseId: "66fedb690024b00dd21a",
    userCollectionId: "66fedd7400215e2798c1",
    videoCollectionId: "66fee07600173885d678",
    blogCollectionId: "670498360020a81682d7",
    blogSavesCollectionId: "6717175400180ead2fbc",
    blogLikesCollectionId: "671eb17f002183aee00b",
    storageId: "66feec0300392f0369a5"
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;
        await signIn(email, password);

        const avatarUrl = avatars.getInitials(username);

        const newUser = await createDatabaseUser(newAccount.$id, email, username, avatarUrl)
        
        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

export  const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw error;
    }
}

const createDatabaseUser = async (accountId, email, username, avatarUrl) => {
    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
            accountId: accountId,
            email: email,
            username: username,
            avatar: avatarUrl
        }
    )
    return newUser;
}

export const getCurrentUser = async() => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        console.log(currentAccount.$id)

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser.total === 0) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        throw error;
    }
}

export const getAllBlogs = async () => {
    try {
        const blogs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId
        )

        return blogs.documents;
    } catch (error) {
        throw error;
    }
}

export const getUserBlogs = async (id) => {
    try {
        const blogs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId
        )   
        let userBlogs = [];
        

        blogs.documents.map( blog => {
            if(blog.author.$id === id) {
                userBlogs.push(blog)
            }
        })

        return userBlogs;
    } catch (error) {
        throw error;
    }
}


export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents;
    } catch (error) {
        throw error;
    }
}

export const getOneBlog = async (query) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            [Query.equal('$id', query)]
        )
        return posts.documents[0];
    } catch (error) {
        throw error;
    }
}

export const getSavedBlogs = async (userId) => {
    try {
        const blogs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogSavesCollectionId
        )
        const savedBlogs = blogs.documents.map( blog => {
            if(blog.users.$id === userId) {
                return blog;
            }
        })
        return savedBlogs;
    } catch (error) {
        throw error;
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw error;
    }
}

// Creates a file url from a storage bucket file
export const getFilePreview = async(fileId, type) => {
    let fileUrl;
    try {
        if(type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId , 2000, 2000, 'top', 100);;
        }
        else if(type === 'video') {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else {
            throw new Error('Error','Invalid file type')
        }

        if(!fileUrl) throw new Error('Error', 'File url creation failed')
        return fileUrl;

    } catch (error) {
        throw error;
    }
}

export const upoadFile = async(file, type) => {
    try {
        if(!file) return;

        const { mimeType, ...rest } = file;
        const asset = {type: mimeType, ...rest};

        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        )

        const fileUrl = [await getFilePreview(uploadedFile.$id, type), uploadedFile.$id];
        return fileUrl;
    } catch (error) {
        throw error;
    }
}

export const createBlog = async(blog) => {
    try {
        let thumbnailUrls = [];
        let thumbnailIds = [];
        for (let x = 0; x < blog.thumbnails.length; x++) {
            if(blog.thumbnails[x].uri.includes('mp4')) {
                const data = upoadFile(blog.thumbnails[x], 'video')
                thumbnailUrls.push(data[0]);
                thumbnailIds.push(data[1])
            } else {
                const data = await upoadFile(blog.thumbnails[x], 'image')
                thumbnailUrls.push(data[0]);
                thumbnailIds.push(data[1])
            }
        }
        const newBlog = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            ID.unique(),
            {
                title: blog.title,
                text: blog.text,
                thumbnails: thumbnailUrls,
                thumbnailids: thumbnailIds,
                likes: 0,
                saves: 0,
                author: blog.userId,
                date: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')
            }
        )
        if(!newBlog) throw new Error('Error', 'Blog creation failed');
        return newBlog;
    } catch (error) {
        throw error;
    }
}

export const editBlog = async(blog) => {
    try {
        let thumbnailUrls = [];
        for (let x = 0; x < blog.newThumbnails.length; x++) {
            if(blog.newThumbnails[x].uri.includes('mp4')) {
                thumbnailUrls.push(upoadFile(blog.newThumbnails[x], 'video'));
            } else {
                thumbnailUrls.push(await upoadFile(blog.newThumbnails[x], 'image'));
            }
        }
        const newBlog = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            blog.blogId,
            {
                title: blog.title,
                text: blog.text,
                thumbnails: [...blog.currentThumbnails, ...thumbnailUrls],
                likes: blog.likes,
                saves: blog.saves,
                author: blog.userId
            }
        )
        if(!newBlog) throw new Error('Error', 'Blog creation failed');
        return newBlog;
    } catch (error) {
        throw error;
    }
}

export const saveLikeCheck = async(type, userId, blogId) => {
    if(type === 'saves') {
        const saveCheck = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogSavesCollectionId,
            [Query.equal('users', userId), Query.equal('blog', blogId)]
        )
        if(saveCheck.documents[0]) return true
        else false;
    }
    if(type === 'likes') {
        const likeCheck = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogLikesCollectionId,
            [Query.equal('users', userId), Query.equal('blog', blogId)]
        )
        if(likeCheck.documents[0]) return true
        else false;
    }
    
}

export const saveBlog = async(blogId, currentSaves, userId) => {
    try {
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogSavesCollectionId,
            ID.unique(),
            {
                blog: blogId,
                users: userId
            }
        )
        const blogUpdate = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            blogId,
            {
                saves: currentSaves + 1
            }
        )
        return blogUpdate.saves;
    } catch (error) {
        throw error;
    }
}

export const likeBlog = async(blogId, currentLikes, userId) => {
    try {
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogLikesCollectionId,
            ID.unique(),
            {
                blog: blogId,
                users: userId
            }
        )
        const blogUpdate = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            blogId,
            {
                likes: currentLikes + 1
            }
        )
        return blogUpdate.likes;
    } catch (error) {
        throw error;
    }
}

export const unLikeBlog = async(blogId, currentLikes, userId) => {
    try {
        const like = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogLikesCollectionId,
            [Query.equal('blog', blogId), Query.equal('users', userId)]
        )
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogLikesCollectionId,
            like.documents[0].$id
        )
        const blogUpdate = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            blogId,
            {
                likes: currentLikes - 1
            }
        )
        return blogUpdate.likes;
    } catch (error) {
        throw error;
    }
}

export const unSaveBlog = async(blogId, currentSaves, userId) => {
    try {
        const save = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogSavesCollectionId,
            [Query.equal('blog', blogId), Query.equal('users', userId)]
        )
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogSavesCollectionId,
            save.documents[0].$id
        )
        const blogUpdate = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            blogId,
            {
                saves: currentSaves - 1
            }
        )
        return blogUpdate.saves;
    } catch (error) {
        throw error;
    }
}

export const deleteBlog = async(blogId, files) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            blogId
        )
        files.map( async(id) => {
            await storage.deleteFile(
                appwriteConfig.storageId,
                id
            )
        })
        return;
    } catch (error) {
        throw error;
    }
}

export const  updateProfile = async(submission, data) => {
    try {
        if(submission === 'username') {
            const usernameCheck = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,              
            )
            usernameCheck.documents.map(  async(user) => {
                if(user.username == data.currentUsername) {
                    const newUser = await databases.updateDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.userCollectionId,
                        data.userId,
                        {
                            username: data.newUsername
                        }
                        
                    )
                    return "Username updated";
                }
                throw new Error('Incorrect username')
            })
        }

        if(submission === 'avatar') {
            const newAvatarUrl= await upoadFile(data.newAvatar, 'image');
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                data.userId,
                {
                    avatar: newAvatarUrl[0],
                    avatarimageid: newAvatarUrl[1]
                }
            )
            await storage.deleteFile(appwriteConfig.storageId, data.avatarfileid)
            return "Profile picture updated"
        }

        if(submission === 'email') {
            const emailCheck = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.search('email', data.currentEmail )]
            )
            if(!emailCheck.documents[0]) throw new Error('Incorrect email')
            if(!validator.isEmail(data.newEmail)) {
                throw new Error('New email provided is not a valid "email" address')
            }
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                data.userId,
                {
                    email: data.newEmail
                }
            )
            return "Email updated";
        }

        if(submission === 'password') {
            const passwordCheck = await account.updatePassword(data.newPassword, data.currentPassword);
            return "Password updated";
        }
    } catch (error) {
        if(error.message == 'Invalid credentials. Please check the email and password.') {
            throw new Error('Incorrect password')
        }
        throw error;
    }
}
