import React, {Component} from 'react';
import {get_friend_profiles, get_self_profile} from "../../api/StaticData";
import {lookup_profile_by_user_id, block_friend, unblock_friend} from "../../dao/ProfileManager";
import PageTitle from "../components/PageTitle";
import default_profile_pic from '../../image/DefaultProfilePic.jpg'
import './FriendProfile.css'
import ReactDOM from 'react-dom';
import ChatView from "../../chat/ChatView";
import {create_chat_session} from "../../chat/ChatSessionManager";
import ChatSessionView from "../../chat/ChatSessionView";
import './UserProfile.css'
import facebook_icon from '../../image/FacebookIcon.png'
class FriendProfile extends Component {

    constructor(props) {
        super(props);
        this.title = "FriendProfile.js";
        this.state = {
            user_id: props.user_id,
            profile_obj: get_friend_profiles()[props.user_id],
            my_profile: get_self_profile()
        }
    }

    componentWillMount() {
        if (this.state.profile_obj === null || this.state.profile_obj === undefined) {
            lookup_profile_by_user_id(this.state.user_id, (err, data) => {
                if (!err) {
                    this.setState({profile_obj: data})
                }
            })
        }
    }

    send_message() {
        ReactDOM.render(<ChatView/>, document.getElementById('main-layout'));

        let my_name = get_self_profile().first_name + " " + get_self_profile().last_name;
        let participant_ids = [get_self_profile().user_id, this.state.profile_obj.user_id];

        create_chat_session(my_name, participant_ids, "", (session_id) => {
            ReactDOM.render(<ChatSessionView session_id={session_id}/>, document.getElementById('session-container'));
        })

    }

    // This function simply sets the
    //      profile_obj.friend_list[friend_id] = false;
    // In order to check whether or not the friend is blocked,
    // you will have to manually check if friend_list[friend_list] === false;
    block_a_friend(friend_id) {
        block_friend(this.state.my_profile.user_id, friend_id, (err, data) => {
            this.setState({my_profile: data});
        });
    }

    // Simply does the opposite of block
    unblock_a_friend(friend_id) {
        unblock_friend(this.state.my_profile.user_id, friend_id, (err, data) => {
            this.setState({my_profile: data});
        });
    }

    render() {
        let profile_pic = this.state.profile_obj.profile_pic || default_profile_pic;
        if (profile_pic === "") profile_pic = default_profile_pic;

        return (
            <div align='center'>
                <PageTitle title="Friend's Profile"/>

                <br/>
                <div className='friend-profile-pic-container'>
                    <img src={profile_pic} alt="" className='friend-profile-pic'/>
                </div>

                <br/>
                <table className=".table4" align="center">
                    <tbody>
                    <tr>
                        <td className=".td3">
                        <span className="glyphicon glyphicon-user"> </span>
                        <label className=".l1">     Name:        {this.state.profile_obj.first_name + " " + this.state.profile_obj.last_name}</label>
                        </td>
                    </tr>
                    <tr>
                        <td className=".td3">
                        <span className="glyphicon glyphicon-screenshot"></span>
                        <label className=".l1">     Major:       {this.state.profile_obj.major}</label>
                        </td>
                    </tr>
                    <tr>
                        <td className=".td3">
                        <span className="glyphicon glyphicon-star"></span>
                        <label>         Year:           {this.state.profile_obj.current_year}</label>

                        </td>
                    </tr>
                    <tr>

                        <td className=".td3">

                        <span className="glyphicon glyphicon-zoom-in"></span>
                        <label className=".l1">     Description:     {this.state.profile_obj.description}</label>

                        </td>
                    </tr>
                    <tr>

                        <td className=".td3">
                        {this.state.profile_obj.fb_link && <a href={this.state.profile_obj.fb_link}><img className="td4" src={facebook_icon} alt="" width='40px'/></a>}
                        </td>

                    </tr>
                    </tbody>
                </table>
                <br/>

                <div>
                    <button className='edit' onClick={this.send_message.bind(this)}>
                        Send message &nbsp;
                        <svg id="i-settings" viewBox="0 0 32 32" width="20" height="20" fill="none"
                             stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round"
                             strokeWidth="2">
                            <path d="M2 4 L30 4 30 22 16 22 8 29 8 22 2 22 Z"/>
                        </svg>
                    </button>
                    &nbsp;

                    {!(this.state.user_id in this.state.my_profile.blocked_user) ? (
                        <button className='edit' onClick={() => {
                            this.block_a_friend(this.state.profile_obj.user_id);
                        }}>Block</button>
                    ) : (
                        <button className='edit' onClick={() => {
                            this.unblock_a_friend(this.state.profile_obj.user_id);
                        }}>Unblock</button>
                    )
                    }
                </div>

                <br/>
            </div>
        )
    }
}


export default FriendProfile;
