import React, { useContext } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import ActivityStore from '../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IPorps {
    openCreateForm: () => void
}
const NavBar: React.FC= () => {
    const activityStore = useContext(ActivityStore);
    return (
        <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                        <img src='/assets/RBoss.jpg' alt="logo"/>
                        Reactivities
                    </Menu.Item>
                <Menu.Item
                    name='Activities'
                />
                    <Menu.Item>
                        <Button onClick={activityStore.openCreateForm} positive content='Create Activity' />
                    </Menu.Item>
                    </Container>
            </Menu>
        </div>
        )
}
export default observer(NavBar);