#pragma strict

var distance : float = 2f;
private var error : float =0f;

function Start () 
{
    var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.up, hit)) 
    {
        if(hit.distance > distance)
        {
        	error = hit.distance - distance;
        	transform.position.y -= error;
        }
        else if(hit.distance < distance)
        {
        	error = distance - hit.distance;
        	transform.position.y += error;
        }
    }
}