#pragma strict

static function ClampAngle(angle : float, min : float, max : float) : float
{
	do
	{
		if(angle < -360)
			angle +=360;
		
		if(angle > 360)
			angle -=360;		
	}
	
	while (angle < -360 || angle > 360);
	{
		
	}
	
	return Mathf.Clamp(angle,min,max);
}

static function ClipPlaneAtNear(pos : Vector3) : MyType
{
	var clipPlanePoints = new MyType();
	
	if(Camera.main == null)
	{
		return clipPlanePoints;
	}
	
	var transform = Camera.main.transform;
	var halfFOV = (Camera.main.fieldOfView /2) * Mathf.Deg2Rad;
	var aspect = Camera.main.aspect;
	var distance = Camera.main.nearClipPlane;
	var height = distance * Mathf.Tan(halfFOV);
	var width = height * aspect;
	
	clipPlanePoints.LowerRight = pos + transform.right * width;
	clipPlanePoints.LowerRight -= transform.up * height;
	clipPlanePoints.LowerRight += transform.forward * distance;
	
	clipPlanePoints.LowerLeft = pos - transform.right * width;
	clipPlanePoints.LowerLeft -= transform.up * height;
	clipPlanePoints.LowerLeft += transform.forward * distance;
	
	clipPlanePoints.UpperRight = pos + transform.right * width;
	clipPlanePoints.UpperRight += transform.up * height;
	clipPlanePoints.UpperRight += transform.forward * distance;
	
	clipPlanePoints.UpperLeft = pos - transform.right * width;
	clipPlanePoints.UpperLeft += transform.up * height;
	clipPlanePoints.UpperLeft += transform.forward * distance;
	
	
	return clipPlanePoints;
}