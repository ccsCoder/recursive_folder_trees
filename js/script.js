var contentJSON = 
{

	"content":[
		{
			name: "bin",
			type: "folder",

		}, {
			name:"dev",
			type:"folder"
		}, {
			name: "opt",
			type: "folder"
		}, {
			name: "lib",
			type:"folder"
		}, {
			name:"sys",
			type:"folder"
		}, {
			name:"media",
			type:"folder"
		}, {
			name: "var",
			type: "folder"
		}, {
			name: "lockfile",
			type: "file"
		}
	],
	"query" : {
		"bin" : [
			{
				name: "file1.txt",
				type: "file"
			}, {
				name: "man",
				type :"binary"
			}, {
				name: "ls",
				type: "binary"
			}, {
				name: "lockfile",
				type: "file"
			}, {
				name: "lib",
				type: "folder"
			}

		]
		, 
		"lib":[
			{
				name:"gcc",
				type:"file"
			}, {
				name:"jvm",
				type:"binary"
			}, {
				name:"cpp",
				type:"binary"
			}, {
				name:"bin",
				type:"folder"
			}, {
				name: "kdump",
				type:"file"
			}, {
				name: "kernel",
				type: "file"
			}


		]
	}
};

function _createLoadingDivFor(domRef) {
	
	var loaderDiv = document.createElement("div");
        loaderDiv.classList.add('loading');
        loaderDiv.style.zIndex = 99999999;
        loaderDiv.style.width = domRef.scrollWidth+"px";
        loaderDiv.style.height = domRef.scrollHeight+"px";

    var spinner=document.createElement('img');
    spinner.setAttribute('src', 'res/img/loading.gif');
    loaderDiv.appendChild(spinner);

    return loaderDiv;

}

function loading(flag) {
    if (flag === false) {
        get('.loading_container').style.display='none';
    } else {    

        get('.loading_container').style.display='flex';
    }

}



document.addEventListener('DOMContentLoaded',function(e){
	init();
});

function get(selector) {
	return document.querySelector(selector);
}

function all(selector) {
	return document.querySelectorAll(selector);
}

function init() {
	var cont = get('#container');
	cont.addEventListener("click",function(e){
		onItemClicked(e);
	});
}

function getDriveContent(driveLetter) {

	return new Promise (function(resolve, reject){
		setTimeout(function() {
			resolve(contentJSON.content);
		}, 1000);
	});	
	
}

function getFolderContent(folderName) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(contentJSON.query[folderName]);
		}, 1000);
	});
}

function createDOMString(result) {
	var str='<ul class="list">';
	result.forEach(function(element){
		str+= `<li class="list-item" type="child_originated"><div class="subtree_item ${element.type}" type="${element.type}">${element.name}</div>

			<div class="toggler"></div>

		</li>`;
	});
	str+="</ul>";
	return str;
}

function populateList(promiseObj, domRef) {
	loading(true);
	promiseObj.then(function (result) {
		//remove togglers if there is nothing here...
		if (!result) {
			domRef.parentNode.querySelector('.toggler').innerHTML='<div class="no-children secondary-text-color">(empty)</div>';
			domRef.parentNode.querySelector('.toggler').classList.remove('expanded','.toggler');

		}
		var domString = createDOMString(result);
		domRef.parentNode.innerHTML+=domString;
		loading(false);
	}).catch(function(res){
		loading(false);
	})
}

function toggleDisplay(ref, value, delay) {
	setTimeout(function() {
		ref.style.display=value;
	}, delay);
}

function _toggleExpandCollapseIcon(domRef, stateText) {
	var ref=domRef.querySelector('.toggler');
	ref.classList.remove('expanded','collapsed');
	ref.classList.add(stateText);
}

function _onTogglerClicked(togglerRef) {	
	var nearestList=togglerRef.parentNode.querySelector('.list');
		nearestList.classList.remove('slideUp', 'slideDown');
	if(togglerRef.classList.contains('expanded')) {   
		nearestList.classList.add('slideUp');
		_toggleExpandCollapseIcon(togglerRef.parentNode, 'collapsed');
		toggleDisplay(nearestList, 'none', 400);
	}
	else if(togglerRef.classList.contains('collapsed')) {
		toggleDisplay(nearestList, 'block',100);
		 nearestList.classList.add('slideDown');
		_toggleExpandCollapseIcon(togglerRef.parentNode, 'expanded');

	}
}


function onItemClicked(event) {

	if(event.target.classList.contains('toggler')) {
		//fire off a branch 
		_onTogglerClicked(event.target);
		return;

	}

	var type=event.target.getAttribute("type");
	
	switch ( type ) {
		case "drive" :
			populateList(getDriveContent(event.target.textContent),event.target);
			_toggleExpandCollapseIcon(event.target.parentNode, 'expanded');
			
		break;
		case "folder" :
			populateList(getFolderContent(event.target.textContent),event.target);
			_toggleExpandCollapseIcon(event.target.parentNode, 'expanded');
		break;
		case "file" :
			alert("It's a file!");
		break;
		case "child_originated": 
			var original = event.target.querySelector('.subtree_item');
			populateList(getFolderContent(original.textContent),original.parentNode);
		break;
		
		default: 
			console.log("other");
		break;
	
	}	
	
}
