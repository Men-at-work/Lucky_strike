#pragma strict

static var Instance : TP_Camera;
var TargetLookAt : Transform;

var DsitanceMin : float = 2f;
var DistanceMax : float = 10f;
var Distance : float = 5f;
var startDistance : float = 5f;
var DistanceSmooth : float = 0.05f;
var DistanceResumeSmooth : float = 1f;
var X_MouseSensitivity : float = 5f;
var Y_MouseSensitivity : float = 5f;
var X_Smooth : float = 0.05f;
var Y_Smooth  :float = 0.1f;
var Y_MinLimit : float = -40f;
var Y_MaxLimit : float = 80f;
var OcclusionDistanceStep : float = 0.5f;
var MaxOcclusionCheks : int = 10;
var DethCameraHeight : float = 20f;
var DethCameraSpinRate : float = 1f;
var DethCameraDistance : float = 10f;

var mouseX : float = 0f;
var mouseY : float = 0f;
var velX : float = 0f;
var velY : float = 0f;
var velZ : float = 0f;
var velDistance : float = 0f;
var position : Vector3 = Vector3.zero;
var desiredPosition: Vector3 = Vector3.zero;
var desiredDistance : float = 0f;
var distanceSmooth : float = 0f;
var preOccludedDistance : float = 0f;

function Awake()
{
	Instance = this;
}

function Start()
{
	Distance = Mathf.Clamp(Distance, DsitanceMin, DistanceMax);
	startDistance = Distance;
	
	Reset();
}

function LateUpdate () 
{
	if(TargetLookAt == null)
	{
		return;
	}
	
	if(!TP_Animator.Instance.IsDead)
	{
		HandlePlayerInput();
	}
	else
	{
		desiredDistance = DethCameraDistance;
		mouseX += Time.deltaTime + DethCameraSpinRate;
		mouseY = DethCameraHeight;
	}
	
	var count = 0;
	do
	{
		CalculateDesirePosition();
		count++;
	}
	while(ChekIfOccluded(count));
	
	UpdatePosition();
}

function HandlePlayerInput()
{
	var deadZone = 0.1f;

	mouseX += Input.GetAxis("Mouse X") * X_MouseSensitivity;
	mouseY -= Input.GetAxis("Mouse Y") * Y_MouseSensitivity;

	
	// This is where we will limit mouseY
	mouseY = Helper.ClampAngle(mouseY, Y_MinLimit, Y_MaxLimit);
}

function CalculateDesirePosition()
{
	ResetDesiredDistance();
	Distance = Mathf.SmoothDamp(Distance, desiredDistance, velDistance, distanceSmooth);
	// Calculate desired position
	desiredPosition = CalculatePosition(mouseY,mouseX,Distance);
}

function CalculatePosition(rotationX : float, rotationY: float, distance : float) : Vector3
{
	var direction : Vector3 = new Vector3(0,0,-distance);
	var rotation : Quaternion = Quaternion.Euler(rotationX, rotationY,0);
	return TargetLookAt.position + rotation * direction;
}

function ChekIfOccluded (count : int) : boolean
{
	var isOccluded = false;
	
	var nearestDistance = ChekCameraPoints(TargetLookAt.position, desiredPosition);
	
	if(nearestDistance != -1)
	{
		if(count < MaxOcclusionCheks)
		{
			isOccluded = true;
			Distance -= OcclusionDistanceStep;
			
			if(Distance < DsitanceMin)
			{
				Distance = DsitanceMin;
			}
		}
		else
		{
			Distance = nearestDistance - Camera.main.nearClipPlane;
		}
		
		desiredDistance = Distance;
		distanceSmooth = DistanceResumeSmooth;
	}
	
	return isOccluded;
}

function ChekCameraPoints(from : Vector3, to : Vector3) : float
{
	var nearestDistance = -1f;
	
	var hitInfo : RaycastHit;
	
	var clipPlanePoints : MyType = Helper.ClipPlaneAtNear(to);
	
	// Draw lines in the editor to take it easier to visualize
	Debug.DrawLine(from, to + transform.forward * -camera.nearClipPlane, Color.red);
	Debug.DrawLine(from, clipPlanePoints.UpperLeft);	
	Debug.DrawLine(from, clipPlanePoints.LowerLeft);	
	Debug.DrawLine(from, clipPlanePoints.UpperRight);	
	Debug.DrawLine(from, clipPlanePoints.LowerRight);	
	
	Debug.DrawLine(clipPlanePoints.UpperLeft, clipPlanePoints.UpperRight);
	Debug.DrawLine(clipPlanePoints.UpperRight, clipPlanePoints.LowerRight);
	Debug.DrawLine(clipPlanePoints.LowerRight, clipPlanePoints.LowerLeft);
	Debug.DrawLine(clipPlanePoints.LowerLeft, clipPlanePoints.UpperLeft);
	
	if(Physics.Linecast(from, clipPlanePoints.UpperLeft, hitInfo) && hitInfo.collider.tag != "player" && hitInfo.collider.tag != "Comet_1")
	{
		nearestDistance = hitInfo.distance;	
	}
	if(Physics.Linecast(from, clipPlanePoints.LowerLeft, hitInfo) && hitInfo.collider.tag != "player" && hitInfo.collider.tag != "Comet_1")
	{
		if(hitInfo.distance < nearestDistance || nearestDistance == -1)
		{
			nearestDistance = hitInfo.distance;
		}
	}
	if(Physics.Linecast(from, clipPlanePoints.UpperRight, hitInfo) && hitInfo.collider.tag != "player" && hitInfo.collider.tag != "Comet_1")
	{
		if(hitInfo.distance < nearestDistance || nearestDistance == -1)
		{
			nearestDistance = hitInfo.distance;
		}
	}
	if(Physics.Linecast(from, clipPlanePoints.LowerRight, hitInfo) && hitInfo.collider.tag != "player" && hitInfo.collider.tag != "Comet_1")
	{
		if(hitInfo.distance < nearestDistance || nearestDistance == -1)
		{
			nearestDistance = hitInfo.distance;
		}
	}
	if(Physics.Linecast(from, to + transform.forward * -camera.nearClipPlane, hitInfo) && hitInfo.collider.tag != "player" && hitInfo.collider.tag != "Comet_1")
	{
		if(hitInfo.distance < nearestDistance || nearestDistance == -1)
		{
			nearestDistance = hitInfo.distance;
		}
	}
	
	return nearestDistance;
}

function ResetDesiredDistance()
{
	if(desiredDistance < preOccludedDistance)
	{
		var pos = CalculatePosition(mouseY, mouseX, preOccludedDistance);
		
		var nearestDistance = ChekCameraPoints(TargetLookAt.position, pos);
		
		if(nearestDistance == -1 || nearestDistance > preOccludedDistance)
		{
			desiredDistance = preOccludedDistance;
		}
	}
}

function UpdatePosition()
{
	var posX = Mathf.SmoothDamp(position.x, desiredPosition.x, velX, X_Smooth);
	var posY = Mathf.SmoothDamp(position.y, desiredPosition.y, velY, Y_Smooth);
	var posZ = Mathf.SmoothDamp(position.z, desiredPosition.z, velZ, X_Smooth);
	position = new Vector3(posX,posY,posZ);
	
	transform.position = position;
	
	transform.LookAt(TargetLookAt);
}

function Reset()
{
	mouseX=0;
	mouseY=10;
	desiredDistance = Distance;
	preOccludedDistance = Distance;
}

static function UseExistingOrCreateNewMainCamera()
{
	var tempCamera : GameObject;
	var targetLookAt : GameObject;
	var myCamera : TP_Camera;
	
	if(Camera.main != null)
	{
		tempCamera = Camera.main.gameObject;
	}
	else
	{
		tempCamera = new GameObject("MainCamera");
		tempCamera.AddComponent("Camera");
		tempCamera.tag = "MainCamera";
	}
	
	tempCamera.AddComponent("TP_Camera");
	myCamera = tempCamera.GetComponent("TP_Camera") as TP_Camera;
	
	targetLookAt = GameObject.Find("targetLookAt") as GameObject;
	
	if(targetLookAt == null)
	{
		targetLookAt = new GameObject("targetLookAt");
		targetLookAt.transform.position = Vector3.zero;
	}
	
	myCamera.TargetLookAt = targetLookAt.transform;
}