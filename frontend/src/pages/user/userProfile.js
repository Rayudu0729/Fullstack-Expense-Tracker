import { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import ProfileCard from "../../components/userProfile/userProfileCard";
import ChangePassword from "../../components/userProfile/changePassword";
import Header from '../../components/utils/header';
import Container from "../../components/utils/Container";
import Loading from "../../components/utils/loading";
import useProfileImage from "../../hooks/useProfileImage";
import { Toaster } from "react-hot-toast";

function UserProfile() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profileImg, isLoading, uploadProfileImage, removeProfileImage] = useProfileImage();

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setEmail(user.email)
            setUsername(user.username)
        }
    }, [])

    return (
        <Container activeNavId={3}>
            <Header title="Settings" />
            <Toaster />
            {isLoading ? (
                <Loading />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <ProfileCard
                        username={username}
                        email={email}
                        profileImg={profileImg}
                        uploadProfileImage={uploadProfileImage}
                        removeProfileImage={removeProfileImage}
                    />
                    <ChangePassword email={email} />
                </div>
            )}
        </Container>
    )
}

export default UserProfile;