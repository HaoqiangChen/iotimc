/**
 * 图片编辑涂鸦画板功能
 * Created by HJ on 2018-02-10.
 */
define([
    'app',
    'safe/js/directives/safeVideoPanel',
    'cssloader!safe/css/safescrawleditwidget'
], function(app) {
    app.directive('safeScrawlEditWidget', ['$timeout',function($timeout) {
        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        return {
            restrict: 'E',
            scope: true,
            template: getTemplate($.soa.getWebPath('iiw.safe') + '/view/scrawleditwidget.html'),
            replace: true,
            compile: function() {
                return {
                    post: function($scope, $element) {
                        var canvas_size,
                            canvas_offset,
                            origin,
                            end,
                            type,
                            eraser,
                            drawable,
                            color_changeable,
                            canvas,
                            canvas2,
                            context,
                            context2,
                            canvas_rgb,
                            canvas_backup,
                            canvas_color,
                            context3,
                            canvas_color_data,
                            // can_data,
                            baseImg,
                            baseoffset_width,
                            baseoffset_height,
                            baseoffset_x,
                            baseoffset_y;

                        $scope.$on('safe.scrawl.open.img', function(event, data) {
                            //$timeout(function() {
                                init(event, data);
                            //},3000);

                        });

                        function init(event, data) {
                            baseImg = data;

                            var box = $('.video-panel-toolbox');
                            var realBox;
                            var box_width;
                            var box_height;
                            _.each(box, function(v) {
                                if(v.clientWidth > 0) {
                                    box_width = v.offsetWidth; //$('.safe-video-panel')[0].offsetWidth;
                                    box_height = v.offsetHeight; //$('.safe-video-panel')[0].offsetHeight;
                                    realBox = v;
                                }
                            });

                            baseoffset_width = box_width - 30; // canvas画布宽度
                            baseoffset_height = box_height - 65; // canvas画布高度

                            $element.find('.canvas').get(0).width = baseoffset_width;
                            $element.find('.canvas').get(0).height = baseoffset_height;
                            $element.find('.canvas2').get(0).width = baseoffset_width;
                            $element.find('.canvas2').get(0).height = baseoffset_height;

                            open_img(data); // 初始化canvas画布

                            /*
                             * getBoundingClientRect--获取dom元素的坐标位置;
                             * 兼容低版本浏览器 -> 低版本浏览器中，获取不到x,y的值，改为获取left与top的值；
                             */
                            baseoffset_x = realBox.getBoundingClientRect().left; // 画布偏移量—X
                            baseoffset_y = realBox.getBoundingClientRect().top; // 画布偏移量—Y

                            canvas_size = {x: baseoffset_width, y: baseoffset_height};
                            canvas_offset = {x: baseoffset_x + 15, y: baseoffset_y + 50};
                            origin = {x: 0, y: 0};
                            end = {x: 0, y: 0};
                            type = 0;
                            drawable = false;
                            color_changeable = false;

                            canvas = $element.find('.canvas').get(0);
                            canvas2 = $element.find('.canvas2').get(0);

                            context = canvas.getContext('2d');
                            context.strokeStyle = '#00aeef';
                            fill_canvas('#ffffff');
                            context.lineWidth = 1;
                            context2 = canvas2.getContext('2d');
                            context2.strokeStyle = '#00aeef';
                            context2.lineWidth = 1;
                            canvas_rgb = {r: 1, g: 1, b: 1};

                            $element.find(canvas2).bind('mousedown', function(event) {
                                drawable = true;
                                origin.x = event.clientX - canvas_offset.x;
                                origin.y = event.clientY - canvas_offset.y;
                            });
                            $element.find(canvas2).bind('mouseup', function() {
                                canvas_backup = context.getImageData(0, 0, canvas.width, canvas.height);
                            });
                            $(document).bind('mouseup', function(event) {
                                if((type == 1 || type == 3 || type == 4) && drawable == true) {
                                    drawable = false;
                                    context2.clearRect(0, 0, canvas_size.x, canvas_size.y);
                                    end.x = event.clientX - canvas_offset.x;
                                    end.y = event.clientY - canvas_offset.y;
                                    draw(context);
                                } else
                                    drawable = false;
                                color_changeable = false;
                            });
                            $(document).bind('mousemove', function(event) {
                                if(drawable == false) return;
                                if(type == 0) {
                                    end.x = event.clientX - canvas_offset.x;
                                    end.y = event.clientY - canvas_offset.y;
                                    draw(context);
                                    origin.x = end.x;
                                    origin.y = end.y;
                                } else if(type == 1 || type == 3 || type == 4 || type == 5) {
                                    end.x = event.clientX - canvas_offset.x;
                                    end.y = event.clientY - canvas_offset.y;
                                    if(type == 5) {
                                        fill_canvas('#ffffff', end.x - 10, end.y - 10, 20, 20);
                                        return;
                                    }
                                    else
                                        context2.clearRect(0, 0, canvas_size.x, canvas_size.y);
                                    draw(context2);
                                }
                                else if(type == 2) {
                                    end.x = event.clientX - canvas_offset.x;
                                    end.y = event.clientY - canvas_offset.y;
                                    draw(context);
                                }
                            });


                            var img = new Image();
                            // img.src = $.soa.getWebPath('iiw.safe') + '/img/scrawl/color.bmp';
                            img.src = 'data:image/bmp;base64,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/////////////////////wAAQED/QEb/QEz/QFP/QFn/QF//QGX/QGv/QHH/QHf/QH3/QIP/QIr/QJD/QJb/QJz/QKP/QKn/QK//QLX/QLz/QML/QMj/QM7/QNT/QNr/QOD/QOb/QOz/QPP/QPn/QP//QP/5QP/zQP/tQP/nQP/hQP/bQP/VQP/PQP/JQP/DQP+9QP+3QP+xQP+rQP+lQP+fQP+aQP+UQP+OQP+IQP+CQP98QP92QP9wQP9qQP9kQP9eQP9YQP9SQP9MQP9GQP9ARv9ATP9AU/9AWf9AX/9AZf9Aa/9Acf9Ad/9Aff9Ag/9Aiv9AkP9Alv9AnP9Ao/9Aqf9Ar/9Atf9AvP9Awv9AyP9Azv9A1P9A2v9A4P9A5v9A7P9A8/9A+f9A//9A//lA//NA/+1A/+dA/+FA/9tA/9VA/89A/8lA/8NA/71A/7dA/7FA/6tA/6VA/59A/5pA/5RA/45A/4hA/4JA/3xA/3ZA/3BA/2pA/2RA/15A/1hA/1JA/0xA/0ZA/0BA/0BA/0BG/0BM/0BT/0BZ/0Bf/0Bl/0Br/0Bx/0B3/0B9/0CD/0CK/0CQ/0CW/0Cc/0Cj/0Cp/0Cv/0C1/0C8/0DC/0DI/0DO/0DU/0Da/0Dg/0Dm/0Ds/0Dz/0D5+UD/80D/7UD/50D/4UD/20D/1UD/z0D/yUD/w0D/vUD/t0D/sUD/q0D/pUD/n0D/mkD/lED/jkD/iED/gkD/fED/dkD/cED/akD/ZED/XkD/WED/UkD/TED/RkD/QED/////////////////////////////////AABgYP9gZf9gav9gcP9gdf9gev9gf/9ghP9gif9gjv9gk/9gmP9gnv9go/9gqP9grf9gsv9gt/9gvP9gwf9gx/9gzP9g0f9g1v9g2/9g4P9g5f9g6v9g7/9g9f9g+v9g//9g//pg//Vg//Bg/+tg/+Zg/+Fg/9xg/9dg/9Jg/81g/8hg/8Ng/75g/7lg/7Rg/69g/6tg/6Zg/6Fg/5xg/5dg/5Jg/41g/4hg/4Ng/35g/3lg/3Rg/29g/2pg/2Vg/2Bl/2Bq/2Bw/2B1/2B6/2B//2CE/2CJ/2CO/2CT/2CY/2Ce/2Cj/2Co/2Ct/2Cy/2C3/2C8/2DB/2DH/2DM/2DR/2DW/2Db/2Dg/2Dl/2Dq/2Dv/2D1/2D6/2D//2D/+mD/9WD/8GD/62D/5mD/4WD/3GD/12D/0mD/zWD/yGD/w2D/vmD/uWD/tGD/r2D/q2D/pmD/oWD/nGD/l2D/kmD/jWD/iGD/g2D/fmD/eWD/dGD/b2D/amD/ZWD/YGD/YGD/YGX/YGr/YHD/YHX/YHr/YH//YIT/YIn/YI7/YJP/YJj/YJ7/YKP/YKj/YK3/YLL/YLf/YLz/YMH/YMf/YMz/YNH/YNb/YNv/YOD/YOX/YOr/YO//YPX/YPr6YP/1YP/wYP/rYP/mYP/hYP/cYP/XYP/SYP/NYP/IYP/DYP++YP+5YP+0YP+vYP+rYP+mYP+hYP+cYP+XYP+SYP+NYP+IYP+DYP9+YP95YP90YP9vYP9qYP9lYP9gYP////////////////////////////////9//39//3+D/3+H/3+M/3+Q/3+U/3+Y/3+c/3+g/3+k/3+o/3+s/3+x/3+1/3+5/3+9/3/B/3/F/3/J/3/N/3/S/3/W/3/a/3/e/3/i/3/m/3/q/3/u/3/y/3/3/3/7/3///3//+3//93//83//73//63//53//43//33//23//13//03//z3//y3//x3//w3//v3//u3//t3//s3//r3//q3//p3//o3//n3//m3//l3//k3//j3//i3//h3//g3//f4P/f4f/f4z/f5D/f5T/f5j/f5z/f6D/f6T/f6j/f6z/f7H/f7X/f7n/f73/f8H/f8X/f8n/f83/f9L/f9b/f9r/f97/f+L/f+b/f+r/f+7/f/L/f/f/f/v/f///f//7f//3f//zf//vf//rf//nf//jf//ff//bf//Xf//Tf//Pf//Lf//Hf//Df/+/f/+7f/+3f/+zf/+vf/+rf/+nf/+jf/+ff/+bf/+Xf/+Tf/+Pf/+Lf/+Hf/+Df/9/f/9/f/9/g/9/h/9/jP9/kP9/lP9/mP9/nP9/oP9/pP9/qP9/rP9/sf9/tf9/uf9/vf9/wf9/xf9/yf9/zf9/0v9/1v9/2v9/3v9/4v9/5v9/6v9/7v9/8v9/9/9/+/t///d///N//+9//+t//+d//+N//99//9t//9d//9N//89//8t//8d//8N//79//7t//7d//7N//69//6t//6d//6N//59//5t//5d//5N//49//4t//4d//4N//39//////////////////////////////////5+fn5//n6L/n6X/n6j/n6v/n67/n7H/n7X/n7j/n7v/n77/n8H/n8T/n8f/n8r/n83/n9H/n9T/n9f/n9r/n93/n+D/n+P/n+b/n+n/n+3/n/D/n/P/n/b/n/n/n/z/n///n//8n//5n//2n//zn//wn//tn//qn//nn//kn//hn//en//bn//Yn//Vn//Sn//Pn//Mn//Jn//Gn//Dn//An/+9n/+6n/+3n/+0n/+xn/+un/+rn/+on/+ln/+in/+fov+fpf+fqP+fq/+frv+fsf+ftf+fuP+fu/+fvv+fwf+fxP+fx/+fyv+fzf+f0f+f1P+f1/+f2v+f3f+f4P+f4/+f5v+f6f+f7f+f8P+f8/+f9v+f+f+f/P+f//+f//yf//mf//af//Of//Cf/+2f/+qf/+ef/+Sf/+Gf/96f/9uf/9if/9Wf/9Kf/8+f/8yf/8mf/8af/8Of/8Cf/72f/7qf/7ef/7Sf/7Gf/66f/6uf/6if/6Wf/6Kf/5+f/5+f/5+i/5+l/5+o/5+r/5+u/5+x/5+1/5+4/5+7/5++/5/B/5/E/5/H/5/K/5/N/5/R/5/U/5/X/5/a/5/d/5/g/5/j/5/m/5/p/5/t/5/w/5/z/5/2/5/5/5/8/J//+Z//9p//85//8J//7Z//6p//55//5J//4Z//3p//25//2J//1Z//0p//z5//zJ//yZ//xp//w5//wJ//vZ//up//t5//tJ//sZ//rp//q5//qJ//pZ//op//n5////////////////////////////////////+/v/+/wf+/w/+/xf+/x/+/yf+/y/+/zv+/0P+/0v+/1P+/1v+/2P+/2v+/3P+/3v+/4P+/4v+/5P+/5v+/6P+/6v+/7P+/7v+/8P+/8/+/9f+/9/+/+f+/+/+//f+///+///2///u///m///e///W///O///G//++//+2//+u//+m//+e//+W//+O//+G//9+//92//9u//9m//9e//9W//9O//9G//8+//82//8u//8m//8e//8W//8O//8G//7/B/7/D/7/F/7/H/7/J/7/L/7/O/7/Q/7/S/7/U/7/W/7/Y/7/a/7/c/7/e/7/g/7/i/7/k/7/m/7/o/7/q/7/s/7/u/7/w/7/z/7/1/7/3/7/5/7/7/7/9/7///7///b//+7//+b//97//9b//87//8b//77//7b//67//6b//57//5b//47//4b//37//3b//27//2b//17//1b//07//0b//z7//zb//y7//yb//x7//xb//w7//wb//v7//v7//v8H/v8P/v8X/v8f/v8n/v8v/v87/v9D/v9L/v9T/v9b/v9j/v9r/v9z/v97/v+D/v+L/v+T/v+b/v+j/v+r/v+z/v+7/v/D/v/P/v/X/v/f/v/n/v/v/v/39v//7v//5v//3v//1v//zv//xv//vv//tv//rv//pv//nv//lv//jv//hv//fv//dv//bv//Zv//Xv//Vv//Tv//Rv//Pv//Nv//Lv//Jv//Hv//Fv//Dv//Bv/+/v////////////////////////////////////9/f/9/g/9/h/9/i/9/j/9/k/9/l/9/m/9/n/9/o/9/p/9/q/9/r/9/s/9/t/9/u/9/w/9/x/9/y/9/z/9/0/9/1/9/2/9/3/9/4/9/5/9/6/9/7/9/8/9/9/9/+/9///9///t///d///N//+9//+t//+d//+N//99//9t//9d//9N//89//8t//8d//8N//79//7t//7d//7N//69//6t//6d//6N//59//5t//5d//5N//49//4t//4d//4N//3+D/3+H/3+L/3+P/3+T/3+X/3+b/3+f/3+j/3+n/3+r/3+v/3+z/3+3/3+7/3/D/3/H/3/L/3/P/3/T/3/X/3/b/3/f/3/j/3/n/3/r/3/v/3/z/3/3/3/7/3///3//+3//93//83//73//63//53//43//33//23//13//03//z3//y3//x3//w3//v3//u3//t3//s3//r3//q3//p3//o3//n3//m3//l3//k3//j3//i3//h3//g3//f3//f3//f4P/f4f/f4v/f4//f5P/f5f/f5v/f5//f6P/f6f/f6v/f6//f7P/f7f/f7v/f8P/f8f/f8v/f8//f9P/f9f/f9v/f9//f+P/f+f/f+v/f+//f/P/f/f/f/v7f//3f//zf//vf//rf//nf//jf//ff//bf//Xf//Tf//Pf//Lf//Hf//Df/+/f/+7f/+3f/+zf/+vf/+rf/+nf/+jf/+ff/+bf/+Xf/+Tf/+Pf/+Lf/+Hf/+Df/9/f/////////////////////////////////7KyAAA=';
                            // img.setAttribute('crossOrigin', 'Anonymous');
                            $(img).bind('load', function() {
                                canvas_color = $element.find('.canvas_color').get(0);
                                context3 = canvas_color.getContext('2d');
                                context3.drawImage(this, 0, 0, this.width, this.height);
                                canvas_color_data = context3.getImageData(0, 0, canvas_color.width, canvas_color.height);
                                $element.find(canvas_color).bind('mousedown', function(event) {
                                    var idx = ((event.clientX - canvas_color.offsetLeft - baseoffset_x - 1) + (event.clientY - canvas_color.offsetTop - baseoffset_y - 1) * canvas_color_data.width) * 4;
                                    var r = canvas_color_data.data[idx + 0];
                                    var g = canvas_color_data.data[idx + 1];
                                    var b = canvas_color_data.data[idx + 2];
                                    $element.find('#color_span').css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
                                    $scope.change_attr(-1, -1, 'rgb(' + r + ',' + g + ',' + b + ')');
                                    color_changeable = true;
                                });
                                $element.find(canvas_color).bind('mousemove', function(event) {
                                    if(color_changeable == false)
                                        return;
                                    var x = event.clientX - canvas_color.offsetLeft - 1;
                                    if(x >= canvas_color_data.width || x < 0)
                                        return;
                                    var y = event.clientY - canvas_color.offsetTop - 1;
                                    if(y >= canvas_color_data.height || y < 0)
                                        return;
                                    var idx = (x + y * canvas_color_data.width) * 4;
                                    var r = canvas_color_data.data[idx + 0];
                                    var g = canvas_color_data.data[idx + 1];
                                    var b = canvas_color_data.data[idx + 2];
                                    $element.find('#color_span').css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
                                    $scope.change_attr(-1, -1, 'rgb(' + r + ',' + g + ',' + b + ')');
                                });
                            });

                            $element.find('#size_bar').bind('mousedown', function(event) {
                                var thumb = $element.find('#size_thumb');
                                var main_w = $(this).width();
                                var mainLeft = $(this).offset().left;
                                thumb.css('left', event.clientX - mainLeft - thumb.width() / 2 + 'px');
                                $element.find('.size_span').html(Math.ceil($(thumb).position().left / main_w * 5) + 1);
                                $scope.change_attr(-1, $element.find('#size_span').html(), -1);
                                $(document).bind('mousemove', size_bar_move);
                                $(document).bind('mouseup', function unbind() {
                                    $(document).unbind('mousemove', size_bar_move);
                                    $(document).unbind('mouseup', unbind);
                                });
                            });

                            size_bar_restore();
                            color_span_restore();

                        }

                        function size_bar_move(e) {
                            var thumb = $element.find('#size_thumb');
                            var main_w = $element.find('#size_bar').width();
                            var mainLeft = $element.find('#size_bar').offset().left;
                            if(e.clientX - mainLeft < 0)
                                thumb.css('left', -thumb.width() / 2 + 'px');
                            else if(e.clientX - mainLeft > main_w)
                                thumb.css('left', main_w - thumb.width() / 2 + 'px');
                            else
                                thumb.css('left', e.clientX - mainLeft - thumb.width() / 2 + 'px');
                            $element.find('#size_span').html(Math.ceil($element.find(thumb).position().left / main_w * 5) + 1);
                            $scope.change_attr(-1, $element.find('#size_span').html(), -1);
                        }

                        function size_bar_restore() {
                            var thumb = $element.find('#size_thumb');
                            thumb.css('left', '0px');
                            $element.find('#size_span').html(1);
                            $scope.change_attr(-1, $element.find('#size_span').html(), -1);
                        }

                        function color_span_restore() {
                            $element.find('#color_span').css('background-color', '#00aeef');
                        }

                        function draw(context) {
                            if(type == 0 || type == 1 || type == 2) {
                                context.beginPath();
                                context.lineCap = 'round';
                                context.moveTo(origin.x, origin.y);
                                context.lineTo(end.x, end.y);
                                context.stroke();
                            } else if(type == 3) {
                                var k = ((end.x - origin.x) / 0.75) / 2,
                                    // w = (end.x - origin.x) / 2,
                                    h = (end.y - origin.y) / 2,
                                    x = (end.x + origin.x) / 2,
                                    y = (end.y + origin.y) / 2;
                                context.beginPath();
                                context.moveTo(x, y - h);
                                context.bezierCurveTo(x + k, y - h, x + k, y + h, x, y + h);
                                context.bezierCurveTo(x - k, y + h, x - k, y - h, x, y - h);
                                context.closePath();
                                context.stroke();
                            } else if(type == 4) {
                                context.beginPath();
                                context.rect(origin.x, origin.y, end.x - origin.x, end.y - origin.y);
                                context.stroke();
                            }
                        }

                        $scope.change_attr = function(tp, sz, clr, era) {
                            if(tp != -1) {
                                type = tp;
                            }

                            if(!era) {
                                eraser = false;

                                if(clr != -1) {
                                    context.strokeStyle = clr;
                                    context2.strokeStyle = clr;
                                } else {
                                    context.strokeStyle = $element.find('#color_span').css('background-color');
                                    context2.strokeStyle = $element.find('#color_span').css('background-color');
                                }

                                if(sz != -1) {
                                    context.lineWidth = sz;
                                    context2.lineWidth = sz;
                                } else {
                                    context.lineWidth = $element.find('#size_span').html();
                                    context2.lineWidth = $element.find('#size_span').html();
                                }
                            } else {
                                eraser = true;
                                context.strokeStyle = '#ffffff';
                                context2.strokeStyle = '#ffffff';
                                context.lineWidth = 40;
                                context2.lineWidth = 40;
                            }
                        }

                        function clear_canvas() {
                            context.clearRect(0, 0, canvas_size.x, canvas_size.y);
                        }

                        function fill_canvas(col, orix, oriy, w, h) {
                            context.fillStyle = col;
                            context.fillRect(orix, oriy, w, h);
                        }

                        $scope.restore_canvas = function() {
                            open_img(baseImg);
                        }

                        $scope.gaussian = function() {
                            var pi = 3.141592654, // get gaussian_array
                                e = 2.718281828459,
                                g = 2,
                                gaussian_array = new Array(),
                                temp = 0;
                            for(var x = 0; x < 2 * g + 1; x++) {
                                gaussian_array[x] = new Array();
                                for(var y = 0; y < 2 * g + 1; y++) {
                                    gaussian_array[x][y] = Math.pow(e, -((x - g) * (x - g) + (y - g) * (y - g)) / (2 * g * g)) / (2 * pi * g * g);
                                    temp += gaussian_array[x][y];
                                }
                            }
                            for(var x = 0; x < 2 * g + 1; x++) {
                                for(var y = 0; y < 2 * g + 1; y++) {
                                    gaussian_array[x][y] /= temp;
                                }
                            }

                            var can_data = context.getImageData(0, 0, canvas.width, canvas.height);
                            var can_data2 = context.getImageData(0, 0, canvas.width, canvas.height);

                            for(var i = g; i < canvas.width - g - 1; i++) {
                                for(var j = g; j < canvas.height - g - 1; j++) {
                                    var idx = (i + j * can_data2.width) * 4;
                                    can_data2.data[idx + 0] = get_gaussian_average(can_data, g, gaussian_array, 0, i, j);
                                    can_data2.data[idx + 1] = get_gaussian_average(can_data, g, gaussian_array, 1, i, j);
                                    can_data2.data[idx + 2] = get_gaussian_average(can_data, g, gaussian_array, 2, i, j);
                                }
                            }
                            context.putImageData(can_data2, 0, 0);
                            canvas_backup = context.getImageData(0, 0, canvas.width, canvas.height);
                        }


                        function get_gaussian_average(can_data, g, gaussian_array, channel, x, y) {
                            var t = 0;
                            for(var i = 0; i < 2 * g + 1; i++) {
                                for(var j = 0; j < 2 * g + 1; j++) {
                                    var idx = (x + i - g + (y + j - g) * can_data.width) * 4;
                                    t += can_data.data[idx + channel] * gaussian_array[i][j];
                                }
                            }
                            return t;
                        }

                        function open_img(url) {
                            var img = new Image();
                            img.src = url;
                            $(img).bind('load', function() {
                                fill_canvas('#ffffff', 0, 0, canvas_size.x, canvas_size.y);
                                context.drawImage(this, 0, 0, baseoffset_width, baseoffset_height);
                                canvas_backup = context.getImageData(0, 0, canvas.width, canvas.height);
                            });

                        }

                    }
                }
            }
        }
    }]);
});