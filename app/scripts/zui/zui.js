'use strict';

var TEMPLATE_PATH = 'scripts/zui/'; // zui/

angular.module('zui',[])

.directive('dropdown', function () {
    return {
        restrict: 'E',
        scope: {
			opt: '=',
            data: '=',
            selected: '=',
            onSelect:'&'
        },
        templateUrl: TEMPLATE_PATH + 'dropdown.html',
        link: function (scope, element, attrs) {

            var $ctrl = $(element).find('.z-dropdown');
            var opt = scope.opt;
            var that = this;

			function find(a, k, v){
				if(a){
					var len = a.length;
					for(var i=0; i<len; i++){
						var b = a[i];
						if(b && b.hasOwnProperty(k) && b[k] == v){
							return i;
						}
					}
				}
				return -1;
			}
			
			function select(v, t) {
			    $ctrl.find('option').filter(function () {
			        return $(this).text() == t;
			    }).prop('selected', true);

			    //$ctrl.val(v);
			    setTimeout(function () {
			        scope.$apply();
			    }, 0);
			}

			function init() {
			    if (opt && opt.bEdit) {
			        var s = scope.selected;
			        if (s) {
			            select(s.value, s.text);
			        } else {
			            select('', opt.placeholder);
			        }
			    } else {
			        select('', opt.placeholder);
			    }

			    $ctrl.change(function (e) {
			        if (scope.data) {
			            var field = scope.opt.valueField;
			            var idx = find(scope.data, field, scope.selected.val);
			            if (idx != -1) {
			                var d = scope.data[idx];
			                if (d && d.hasOwnProperty(scope.opt.textField))
			                    scope.selected.text = d[scope.opt.textField];

			                if (scope.onSelect) {
			                    scope.onSelect({ item: d });
			                }
			            }
			        }
			    });
			}

			init();
			
        }// end of link
    }
})


.directive('checkbox', function () {
    return {
        restrict: 'E',
        scope: {
            onAfter: '&onAfter', // after check callback
            opt: '=',
            checked: '='
        },
        templateUrl: TEMPLATE_PATH + 'checkbox.html',
        link: function (scope, element, attrs) {

            var $chk = $(element).find('.z-checkbox');
            var opt = scope.opt;

            function init() {
                if (opt && !opt.hasOwnProperty('icon')) {
                    opt.icon = { 'checked': 'z-checked fa fa-2x fa-check-square-o', 'unchecked': 'z-unchecked fa fa-2x fa-square-o' }; 
                }

                setTimeout(function () {
                    $chk.find('.z-checked').click(function () {
                        if (scope.opt.enabled)
                            scope.toggle();
                    });

                    $chk.find('.z-unchecked').click(function () {
                        if (scope.opt.enabled)
                            scope.toggle();
                    });
                }, 0);
            }

            scope.toggle = function () {
                scope.checked = !scope.checked;
                setTimeout(function () {
                    scope.$apply();

                    if (scope.onAfter)
                        scope.onAfter({ 'bChecked': scope.checked });
                }, 0);
            }

            scope.$watch("opt.enabled", function (newVal, oldVal) {
                //scope.opt.enabled = newVal;
            });


            //scope.$watch("checked", function (newVal, oldVal) {
            //    if (newVal != oldVal) {
                    
            //        if (scope.onAfter)
            //            scope.onAfter({ 'bChecked': newVal });
            //    }
            //});

            init();
        }// end of link
    }
})


.directive('list', function () {
    return {
        restrict: 'E',
        scope: {
			opt: '=',
            data: '=',
            selected: '=',
            onSelect:'&'
        },
        templateUrl: TEMPLATE_PATH + 'list.html',
        link: function (scope, element, attrs) {

            var $ctrl = $(element).find('.z-list');
            var opt = scope.opt;
            var that = this;
			
			scope.select = function(d) {
				if(scope.onSelect){
					scope.onSelect({'item': d});
				}
			}

			function init() {
				if(scope.opt && !scope.opt.limit)
					scope.opt.limit = 50;
				
				if(scope.opt && scope.opt.template){ // has row template
					if(scope.data && scope.data.length > 0){
						// to be support template
					}else{
						// No item in the list
					}
				}else{
					if(scope.data && scope.data.length > 0){

					}else{
						// No item in the list
					}
				}
				
				//if(opt.template){
				//	var ts = opt.template.match(/{{[^}]*}}/g);
				//	if(ts){
				//		for(var i=0; i<ts.length; i++){
				//			ts.replace(/{{/g, '').replace(/}}/g,'')
				//		}
				//	}
				//}
				
			}

			init();
			
        }// end of link
    }
})
.directive('grid', function () {
    return {
        restrict: 'E',
        scope: {
			opt: '=',
            data: '=',
            selected: '=',
            onSelect:'&'
        },
        templateUrl: TEMPLATE_PATH + 'grid.html',
        link: function (scope, element, attrs) {

            var $ctrl = $(element).find('.z-grid');
            var opt = scope.opt;
            var that = this;

			
			scope.select = function(d) {
				if(scope.onSelect){
					scope.onSelect({'item': d});
				}
			}

			function init() {
				if(scope.opt && scope.opt.fields){
					for(var i=0;i<scope.opt.fields.length; i++){
						if(!scope.opt.fields[i].limit){
							scope.opt.fields[i].limit = 50;
						}
					}
				}
				
				if(scope.opt && scope.opt.template){ // has row template
					if(scope.data && scope.data.length > 0){
						// to be support template
					}else{
						// No item in the list
					}
				}else{
					if(scope.data && scope.data.length > 0){

					}else{
						// No item in the list
					}
				}
				
			}

            //scope.$watch("data", function (newValue, oldValue) {});
			
			init();
			
        }// end of link
    }
})
.directive('headerBar', function () {
    return {
        restrict: 'E',
        scope: {
			opt: '=',
            data: '='
        },
        templateUrl: TEMPLATE_PATH + 'header-bar.html',
        link: function (scope, element, attrs) {

            var $ctrl = $(element).find('.z-header');
            var opt = scope.opt;
            var that = this;
			
			scope.select = function(d) {
				if(scope.onSelect){
					scope.onSelect({'item': d});
				}
			}

			function init() {
				if(scope.opt && scope.opt.template){ // has row template
					if(scope.data && scope.data.length > 0){
						// to be support template
					}else{
						// No item in the list
					}
				}else{
					if(scope.data && scope.data.length > 0){

					}else{
						// No item in the list
					}
				}
				
			}

			init();
			
        }// end of link
    }
})

// step 1: reader.onload()
// step 2: scope.upload()
// step 3: http.post('api/upload')
.directive('uploader', function () {
    return {
        restrict: 'E',
        scope: {
            opt: '=',
            onComplete: '&',
            onBefore: '&'
        },
        templateUrl: TEMPLATE_PATH + '/uploader.html',
        link: function (scope, element, attrs) {
        	
        	var $container = $(element).find('.uploader');
        	var $btn = $container.find('.uploader-btn');
            var d = scope.data;
            var reader = new FileReader();
            var _data;

			//----------------------------------------------------------------------
			// Upload object and  its call backs 
			//----------------------------------------------------------------------
			var oReq = new XMLHttpRequest();
			oReq.upload.addEventListener("progress", updateProgress, false);
			oReq.upload.addEventListener("load", transferComplete, false);
			oReq.upload.addEventListener("error", transferFailed, false);
			oReq.upload.addEventListener("abort", transferCanceled, false);
			
            scope.file = {name:''};

            var img = new Image();
			//-----------------------------------------------------------------------------------------------------
			// This event will be triggered by 2 cases, when assign img.src:
			//		1. select the item
			//		2. open file dialog and select
			// Load image by selecting from file dialog, Change image array after add new image from file dialog
			//-----------------------------------------------------------------------------------------------------
			img.onload = function(){
				scope.opt.size = scope.getDimension(img, 128, 96);
				scope.upload(img.src);
			}
			
			scope.getDimension = function(image, maxWidth, maxHeight){
				//var maxWidth = $canvas.width();
				//var maxHeight = $canvas.height();
				var w = image.width;
				var h = image.height;
				
				if(h > maxWidth || w > maxHeight){
					var ratioH = h / maxHeight;
					var ratioW = w / maxWidth;
					var ratio = ratioW > ratioH ? ratioW : ratioH;
					
					h = image.height/ratio;
					w = image.width/ratio;
				}
				
				return { width: w, height: h };
			}
            
			$btn.click(function(){
            	$container.find('.upload-input').click();
            });
            
            function dataURItoBlob(dataURI) {
        	    // convert base64/URLEncoded data component to raw binary data held in a string
        	    var byteString;
        	    if (dataURI.split(',')[0].indexOf('base64') >= 0){
        	        byteString = atob(dataURI.split(',')[1]);
        	    }else{
        	        byteString = unescape(dataURI.split(',')[1]);
        	    }
        	    // separate out the mime component
        	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        	    // write the bytes of the string to a typed array
        	    var ia = new Uint8Array(byteString.length);
        	    for (var i = 0; i < byteString.length; i++) {
        	        ia[i] = byteString.charCodeAt(i);
        	    }

        	    return new Blob([ia], {type:mimeString});
        	}
            
			scope.onSelect = function(image){
				// Change image to be selected in the image array
				ImageUploaderService.changeImage(image.order, image, scope.images);
				
				// trigger 'selectedImage' event and update thumbnail list
				scope.selectedImage = image;
			}
			
								
			scope.fileChanged = function(element){
				var files = element.files;
				
				// ok button handler
				if (files && files[0]) {
					scope.file = {'name': files[0].name};
					reader.readAsDataURL(files[0]);
					scope.file.name = files[0].name;
				}else{
					// cancel button hander
					scope.file.name = '';
				}
			}
			
			//----------------------------------------------------------------------------------------------
			// This event will be called first when select the image from file dialog
			// call back for the file dialog
			//----------------------------------------------------------------------------------------------
			reader.onload = function(e) {
				// Trigger 'load' event for the canvas
				//img.src = e.target.result;
				//_data = e.target.result;
				if(scope.opt){
					if(scope.opt.type=='pic'){
						img.src = e.target.result;
					}else{
						if(scope.onBefore){
							if(scope.onBefore({'data':e.target.result})){
								scope.upload(e.target.result);
							}
						}
					}
				}
					
				//readerLoaded = true;
			}
			
			//----------------------------------------------------------------------------------------------
			// This event will be triggered by 2 cases, when assign img.src:
			//		1. select the item
			//		2. open file dialog and select
			// Load image by selecting from file dialog, Change image array after add new image from file dialog
			//----------------------------------------------------------------------------------------------
			/*img.onload = function(){
				   var newSize = ImageUploaderService.adjustImageSize(img, $(previewCanvas));
				   
				   var ctx = previewCanvas.getContext("2d");
				   ctx.restore();
				   bImageLoaded = false;
				   
				   // Resize and redraw the preview in the middle
			};*/
			
			//----------------------------------------------------------------------------------------------
			// This event will be triggered by 2 cases:
			//		1. select the item
			//		2. open file dialog and select
			// call back for the canvas
			//----------------------------------------------------------------------------------------------
			/*img.addEventListener("load", function() {
				
				if(!imageLoaded){
					// Redraw the preview
					var data = previewImage(img);
				}

				// Change image array after add new image from file dialog
				var index = ImageUploaderService.getSelectedIndex(scope.images);
				scope.images[index].data = data;
				
				// Rebuild DOM to update the thumbnail list for adding image
				scope.$apply(function () {});
				
			}, false);*/

			
			function transferComplete (e) {
				scope.progressVal = 100;
				scope.$apply(function () {
					scope.progressVal = 100;
				});
				
				if(scope.onComplete)
					scope.onComplete();
				console.log("transferComplete");
			}
			
			function updateProgress (e) {
			    var done = e.position || e.loaded, total = e.totalSize || e.total;
			    scope.$apply(function () {
			    	scope.progressVal = Math.floor(done/total*1000)/10;
				});
				console.log("updateProgress");
			}
			
			function transferFailed (e) {
				console.log("transferFailed");
			}
			
			function transferCanceled (e) {
				console.log("transferCanceled");
			}
			
			
			//
            scope.upload = function(d){
            	// Trigger 'load' event for the canvas
				//img.src = e.target.result;
            	
    			var formData = new FormData();
    			
    			if(scope.file.name){
    				var blob = dataURItoBlob(d);
    				var info = {type: scope.opt.type, fname: scope.file.name, 'info': scope.opt.info};
    				
    				if(scope.opt.type == 'pic'){
    					info.width = scope.opt.size.width;
    					info.height = scope.opt.size.height;
    				}
    				
        			formData.append('info', JSON.stringify(info));
    				formData.append('fdata', blob);
        			
        			// ----------------------------------------------------------------------
        			// void open(DOMString method, DOMString url, optional boolean async, 
        			//		optional DOMString? user, optional DOMString? password)
        			// ----------------------------------------------------------------------
        			oReq.open("post", "/api/upload", true);
    				
        			// ----------------------------------------------------------------------
        			// You must call setRequestHeader() after open(), but before send(). 
        			// If this method is called several times with the same header, the 
        			// values are merged into one single request header.
        			// ----------------------------------------------------------------------
        			//oReq.setRequestHeader('Content-Type', "multipart/form-data;boundry:xxxx");
        			
        			// ----------------------------------------------------------------------
        			// void send(FormData data);
        			// ----------------------------------------------------------------------
        		    oReq.send(formData);

    			}
    			
    			//var fullPath = document.getElementById('upload-input').value;
    			
            }
            
        }
    }
})
// Template example:
//<tab opt=my.opt data=my.data class="z-tab">
//    <ul class="z-tab-heads">
//        <li ng-repeat="t in tab.data"><div class="tab-item">{{t.text}}</div></li>
//    </ul>
//    <div class="z-page" data-index="0">
//        Fill in my own page 1
//    </div>
//    <div class="z-page" data-index="1">
//        Fill in my own page 2
//    </div>
//</tab>
.directive('tab', function () {
    return {
        restrict: 'E',
        scope: {
            opt: '=',
            data: '=',
            selected: '='
        },
        template: 
        	'<ul class="row z-tab-heads"></ul>' +
        	'<div ng-transclude></div>',
        transclude: true,
        link: function (scope, element, attrs) {

            var $ctrl = $(element);
            var $headHolder = $ctrl.find('.z-tab-heads');
            
            $headHolder.empty();
            for(var i=0; i<scope.data.length; i++){
            	$headHolder.append('<li><div class="tab-item">' + scope.data[i].text + '</div></li>');
            }
            
            var $heads = $ctrl.find('.z-tab-heads li');
            var $pages = $ctrl.find('.z-page');

            var tabs = scope.data;
            var n = tabs.length ? tabs.length : 0;
            var self = scope;

            // Default values
            var padding = (scope.opt && scope.opt.padding) > 0 ? scope.opt.padding : 10;
            var wpc = 10; // width per char
            var maxchars = (scope.opt && scope.opt.maxchars > 0) ? scope.opt.maxchars : 50;
            var w = wpc * maxchars + 2 * padding;


            scope.opt.maxchars = maxchars;

            if (tabs && (n > 0)) {
                for (var i = 0; i<tabs.length; i++){
                    var t = tabs[i];
                    w = (t.text.length < maxchars)? wpc * t.text.length : wpc * maxchars;
                    $($heads[i]).find('.tab-item').width(w);
                }
            }

            //-------------------------------------------------
            // Argument:
            //  None
            scope.initTabs = function () {
                scope.showTab(0);
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the page, start from 0
            scope.showTab = function (index) {
                for (var i = 0; i < $heads.length; i++) {
                    var $tab = $($heads[i]);

                    if (i == index) {
                        $tab.addClass('active');
                    } else {
                        $tab.removeClass('active');
                    }
                }
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the tab, start from 0
            scope.nextTab = function (index) {
                if (index < $heads.length - 1) {
                    scope.showTab(index + 1);
                }
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the tab, start from 0
            scope.prevTab = function (index) {
                if (index > 0) {
                    scope.showTab(index - 1);
                }
            }


            //-------------------------------------------------
            // Arguments:
            //  id --- current page id
            scope.isActive = function ($page) {
                return $page.hasClass('active');
            }
            
            //-------------------------------------------------
            // Arguments:
            //  id --- current page id
            scope.initPages = function () {
                $($pages[0]).addClass('active');
                for (var i = 0; i < $pages.length; i++){
                    var $page = $($pages[i]);

                    if (scope.isActive($page)) {
                        $page.show();
                    } else {
                        $page.hide();
                    }
                }
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the page, start from 0
            scope.showPage = function (index) {
                for (var i = 0; i < $pages.length; i++){
                    var $page = $($pages[i]);
                    if (index == i) {
                        $page.addClass('active');
                        $page.show();
                    } else {
                        $page.removeClass('active');
                        $page.hide();
                    }
                }
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the page, start from 0
            scope.next = function (index) {
                if (index < $pages.length - 1) {
                    scope.showPage(index + 1);
                    scope.selected = { 'index': index + 1 };
                }
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the page, start from 0
            scope.prev = function (index) {
                if (index > 0) {
                    scope.showPage(index - 1);
                    scope.selected = { 'index': index - 1 };
                }
            }

            //-------------------------------------------------
            // Argument:
            //  index --- index of the page, start from 0
            function validatePrevPages(index) {
                var bPass = true;
                var i = 0;
                for (i = 0; i < index; i++) {
                    if (tabs[i].validate) {
                        if (!tabs[i].validate()) {
                            bPass = false;
                            break;
                        }
                    }
                }
                return { 'result': bPass, 'index': i };
            }
            
			function find(a, k, v){
				if(a){
					var len = a.length;
					for(var i=0; i<len; i++){
						var b = a[i];
						if(b && b.hasOwnProperty(k) && b[k] == v){
							return i;
						}
					}
				}
				return -1;
			}


			scope.$watch("selected", function (newVal, oldVal) {
                if (scope.selected) {
                    var index = parseInt(scope.selected.index);
                    scope.showTab(index);
                    scope.showPage(index);
                }
            });

            scope.initTabs();
            scope.initPages();
            //-------------------------------------------------
            // tab head click handler
			$.each($heads, function(i, v){
				$(v).click(function(index){
					return function(){
						var r = validatePrevPages(index);
	                    if (r.result) {
	                        scope.showPage(index);
	                        scope.showTab(index);
	                        scope.selected = { 'index': index };
	                    } else {
	                        scope.showPage(r.index);
	                        scope.showTab(r.index);
	                        scope.selected = { 'index': r.index };
	                    }
					}
				}(i));
			});
        }// end of link
    }
})
