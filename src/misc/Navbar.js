import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { NavLink } from 'react-router-dom'
import { Container, Dropdown, Menu } from 'semantic-ui-react'
import { getUsernameFunc } from './Helpers'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { keycloak } = useKeycloak()
  localStorage.setItem('keycloak', JSON.stringify(keycloak))
  const navigate = useNavigate()

  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      navigate('/')
      keycloak.logout()
    } else {
      keycloak.login()
    }
  }

  const getLogInOutText = () => {
    return keycloak.authenticated ? "Logout" : "Login"
  }

  const getUsername = () => {
    return getUsernameFunc(keycloak)
  }  

  return (
    <Menu inverted color='violet' stackable size='massive' style={{borderRadius: 0}}>
      <Container>
        <Menu.Menu position='right'>
          {keycloak.authenticated &&
            <Dropdown text={`Hi ${getUsername()}`} pointing className='link item'>
            </Dropdown>
          }
          <Menu.Item as={NavLink} to="/login" onClick={handleLogInOut}>{getLogInOutText()}</Menu.Item>
        </Menu.Menu>        
      </Container>
    </Menu>
  )
}

export default Navbar