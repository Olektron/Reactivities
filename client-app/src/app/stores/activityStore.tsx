import { observable, action ,computed,configure,runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { parse } from 'path';

configure({ enforceActions: 'always' });

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable activityRegistry = new Map();
    @observable target = '';

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity',() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            }) 
        }
        catch (error) {
            runInAction('delete activity',() => {
                this.submitting = false;
                this.target = '';
                console.log(error);
            })
        }
    }
    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();

            runInAction('loading activities',() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0]
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            })
        }
        catch (error) {
            runInAction('loading activities error',() => {
                console.log(error);
                this.loadingInitial = false;
            })
        }
    };
    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };
    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity',() =>{
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            })            
        }
        catch (error) {
            runInAction('creating activity error',() => {
                this.submitting = false;
                console.log(error);
            })
        }
    };
    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }
    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }
    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity',() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            })
        }
        catch (error) {
            runInAction('edit activity',() => {
                this.submitting = false;
                console.log(error);
            })
        }       
    }
    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }
    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
    @action cancelFormOpen = () => {
        this.editMode = false;
    }
}
export default createContext(new ActivityStore())