var socket = io('http://207.148.119.205');

$(document).ready(()=>{
    $('.log-in').show();
    $('.set-gia-tri').hide();
    $('#thoigian').hide();
    var today1 = moment().format("DD/MM/YYYY");
    $('.date').html(today1);

    socket.on('Server send data', function(data){
        $("#EC").html(data.EC);
        $("#pH").html(data.pH);
        $("#tempEnv").html(data.tempEnv);
        $("#humd").html(data.humd);
        $("#tempWater").html(data.tempWater);
    });
    socket.on('Server send status', (data)=>{
        $('#B0').html(data.B0);
        $('#B1').html(data.B1);
        $('#B2').html(data.B2);
        $('#B3').html(data.B3);
        $('#B4').html(data.B4);
        $('#B5').html(data.B5);
        $('#van').html(data.van);
    })
    socket.on('Server send setData', (data)=>{
        document.getElementById('setEC').innerHTML= data.setEC;
        document.getElementById('setpH').innerHTML= data.setpH;
        document.getElementById('setLoaiCay').innerHTML= data.setLoaiCay;
        document.getElementById('setGiaiDoan').innerHTML= data.setGiaiDoan;
        document.getElementById('setStartDay').innerHTML = data.setStartDay;

        var _date = new Date();
        var dd = _date.getDate().toString();
        var mm = (_date.getMonth()+1).toString();
        var yyyy = _date.getFullYear().toString();

        var today = dd+"/"+mm+"/"+yyyy;
        var daysBetween = soNgayTrong(data.setStartDay, today);
        document.getElementById('timeOfGrow').innerHTML = daysBetween;
    });
    
});

function setFunction(){
    document.getElementById('setGiaiDoan').innerHTML=document.getElementById('inputGiaiDoan').value;
    document.getElementById('setLoaiCay').innerHTML=document.getElementById('inputLoaiCay').value;
    document.getElementById('setEC').innerHTML=document.getElementById('inputEC').value;
    document.getElementById('setpH').innerHTML=document.getElementById('inputpH').value;
};

function resetFunction(){
    $('#setGiaiDoan').html("..");
    $('#setLoaiCay').html("..");
    $('#setEC').html("..");
    $('#setpH').html("..");  
};

function startFunction(){
    
    var _date = new Date();
    var dd = _date.getDate().toString();
    var mm = (_date.getMonth()+1).toString();
    var yyyy = _date.getFullYear().toString();

    var today = dd+"/"+mm+"/"+yyyy;
    var setData = {
        id: 1,
        setEC: parseFloat(document.getElementById('inputEC').value),
        setpH: parseFloat(document.getElementById('inputpH').value),
        setLoaiCay: document.getElementById('inputLoaiCay').value,
        setGiaiDoan: parseInt(document.getElementById('inputGiaiDoan').value),
        setStartDay: today,
        status: "true"
    };
    socket.emit('user send setData', setData);   
};

function stopFunction(){
    var today = moment().format("DD/MM/YYYY");
    var setData = {
        id: 1,
        setEC: 2.5,
        setpH: 6.0,
        setLoaiCay: 'Cải thìa',
        setGiaiDoan: 1,
        setStartDay: today,
        status: "false",
    };
    console.log(setData);
    socket.emit('user send stop', setData); 
};

function soNgayTrong(_startDay, _today){
    var x = _startDay.split('/');
    var y = _today.split('/');

    var a = new Date(x[2],x[1],x[0]);
    var b = new Date(y[2],y[1],y[0]);

    var c = ( b - a );

    var d = c / (1000 * 60 * 60 * 24);
    return d;
};

function logInFunction()
{
    if(document.getElementById('txtUserName').value === "Admin"){
        $('.log-in').hide();
        $('.set-gia-tri').show();
    };
};