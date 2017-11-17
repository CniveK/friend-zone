import Profile from './Profile'
import firebase from 'firebase';


/* callback (true, null) if dne or (null, Profile) */
export function lookup_profile_by_user_id(user_id, callback){
    let db = firebase.database();
    db.ref('Profile/'+user_id).once('value').then(function(snapshot){

        let content = snapshot.val();
        if (content === null)
            callback(true, null);
        else{
            let profile = new Profile(
                user_id,
                content.first_name,
                content.last_name,
                content.major,
                content.current_year,
                content.profile_pic,
                content.description
            );
            profile.enrolled_courses = content.enrolled_courses ||{};
            profile.friend_list = content.friend_list ||{};
            profile.outgoing_request = content.outgoing_request ||{};
            profile.incoming_request = content.incoming_request ||{};
            callback(null, profile);
        }
    })
}


export function add_course_to_profile(user_id, course_id){
    lookup_profile_by_user_id(user_id, function(err, profile){
        if (!err) {
            profile.enrolled_courses[course_id] = true;
            profile.push();
        }
    })
}


export function create_friend_request(from_id, to_id) {

    lookup_profile_by_user_id(from_id, (err, from_profile)=>{
        from_profile.outgoing_request[to_id] = true;
        from_profile.push();
    });
    lookup_profile_by_user_id(to_id, (err, to_profile)=>{
        to_profile.incoming_request[from_id] = true;
        to_profile.push();
    })
}

export function accept_friend_request(from_id, to_id){

    lookup_profile_by_user_id(to_id, (err, to_object)=>{
        to_object.incoming_request[from_id] = null;
        to_object.friend_list[from_id] = true;
        to_object.push();
    });
    lookup_profile_by_user_id(from_id, (err, from_object)=>{
        from_object.outgoing_request[to_id] = null;
        from_object.friend_list[to_id] = true;
        from_object.push();
    })
}

export function decline_friend_request(from_id, to_id){

    lookup_profile_by_user_id(to_id, (err, to_object)=>{
        to_object.incoming_request[from_id] = null;
        to_object.push();
    });
    lookup_profile_by_user_id(from_id, (err, from_object)=>{
        from_object.outgoing_request[to_id] = null;
        from_object.push();
    })
}

