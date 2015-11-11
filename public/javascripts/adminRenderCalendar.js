/**
 * Created by NN on 22.10.2015.
 */
$(document).ready(function () {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var calendar = $('#calendar').fullCalendar({
        timeFormat:'H:mm{ - H:mm}',
        header:{
            left:'prev,next today',
            center:'title',
            right:'month,agendaWeek,agendaDay'
        },
        selectable:true,
        selectHelper:true,
        select:function (start, end, allDay) {

            swal({   title: "New event!",   text: "Write event title:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Write something" }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }     swal("Nice!", "You wrote: " + inputValue, "success"); jQuery("#newTitle").val(inputValue);
                    jQuery("#newStart").val(convertDate(start));
                    jQuery("#newEnd").val(convertDate(end));
                    jQuery("#newAllDay").val(allDay);

                    jQuery.ajax({
                        type: 'POST',
                        url:  jQuery("#eventFormNew").attr("action"),
                        data: jQuery("#eventFormNew").serialize() ,
                        dataType: "json",
                        statusCode: {
                            200: function(data) {
                                calendar.fullCalendar('renderEvent',{id:data.id,title:inputValue,start:start,end:end,allDay:allDay, url:data.url },true);
                            }
                        }  });} );

            calendar.fullCalendar('unselect');
        },
        eventDrop:function(event,dayDelta,minuteDelta,allDay,revertFunc){

            if (typeof event.id == "undefined"){
                alert("This event can not be changed!");
                revertFunc();
                return false;
            }

            jQuery("#moveId").val(event.id);
            jQuery("#moveDayDelta").val(dayDelta);
            jQuery("#moveMinuteDelta").val(minuteDelta);
            jQuery("#moveAllDay").val(allDay);


            jQuery.ajax({
                type:   'POST',
                url:    jQuery("#eventFormMove").attr("action"),
                data:   jQuery("#eventFormMove").serialize(),
                statusCode:{
                    400: function(data) {
                        revertFunc();
                        alert(data.responseText);
                    }
                }
            });

        },

        eventResize: function(event,dayDelta,minuteDelta,revertFunc) {
            if (typeof event.id == "undefined"){
                alert("This event can not be changed!");
                revertFunc();
                return false;
            }

            jQuery("#resizeId").val(event.id);
            jQuery("#resizeDayDelta").val(dayDelta);
            jQuery("#resizeMinuteDelta").val(minuteDelta);
//            jQuery.post(jQuery("#eventFormResize").attr("action"), jQuery("#eventFormResize").serialize());

            jQuery.ajax({
                type:   'POST',
                url:    jQuery("#eventFormResize").attr("action"),
                data:   jQuery("#eventFormResize").serialize(),
                statusCode:{
                    400: function(data) {
                        revertFunc();
                        alert(data.responseText);
                    }
                }
            });
        },
        windowResize: function(view) {
            setNewHeight();
        },
        editable:true,

        events: {
            url:"/events.json",
            cache: true,
            editable:true
        }
    });
    setNewHeight();
});

function convertDate(date){
    return(date.getDate()+"."+(date.getUTCMonth()+1)+"."+date.getUTCFullYear()+" "+date.getHours()+":"+date.getMinutes());
}

function setNewHeight() {
    newHeight = jQuery(window).height() - 70; // 60 is padding of the body tag in main.css (required for Bootstrap's header)
    $('#calendar').fullCalendar('option', 'height', newHeight);
}