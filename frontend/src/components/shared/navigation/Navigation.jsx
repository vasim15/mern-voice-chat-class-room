import React from 'react'
import { Link } from 'react-router-dom'
import style from './Navigation.module.css'
import{ useSelector, useDispatch} from 'react-redux'
import { logout } from '../../../http'
import { setAuth } from '../../../store/authSlice'
const Navigation = () => {
    const {user, isAuth} = useSelector(state=>state.auth)
    const dispatch = useDispatch();
    const brandStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: 22,
        display: 'flex',
        alignItems: 'center'
    }

    const logoText = {
        marginLeft: 10
    }

    const logoutUser = async ()=>{
        try {
        const { data } = await logout();
        if(data){
            dispatch(setAuth(data));
        }

            
        } catch (error) {
            console.log(error)
        }


    }

    return (
        <nav className={`${style.navbar} container`}>
            <Link to='/' style={brandStyle}>
                <img src="/images/logo.png" alt="logo"/>
                <span style={logoText} >codersHouser</span>
            </Link>
            {
                isAuth && (
                    <div className={style.navRight}>
                        <h3>{user?.name}</h3>
                        <Link to='/'>
                            <img className={style.avatar}
                            src={
                                user?.avatar ? user.avatar: 
                                '/images/monkey-avatar.png'
                            }
                            width='40'
                            height='40'
                            alt='avatar'
                            />
                        </Link>
                        <button 
                        className={style.logoutButton}
                        onClick={logoutUser}
                        >
                            <img src='/images/logout.png'
                            alt='logut'
                            />
                        </button>
                    </div>
                )
            }
        </nav>
    )
}

export default Navigation
