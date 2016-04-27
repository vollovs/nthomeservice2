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
			    if (opt.bEdit) {
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