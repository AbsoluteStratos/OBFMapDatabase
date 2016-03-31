/**
 * Created by Nick on 3/29/2016.
 */
$(document).ready(function(){
    var n = 100;
    var particles = new Array();
    var xcen = 250;
    var ycen = 250;
    var maxrad = Math.sqrt(xcen*xcen + ycen*ycen);
    var speedrange = 20.0;
    var minspeed = 20.0; //Max rad change in 0.5sec

    for (var i = 0; i < n; i++) {
        var particle = {};
        particle.rad = (Math.random() * maxrad);
        particle.theta = (Math.random() * 360)*Math.PI/180;
        particle.size = Math.trunc(Math.random() * 1.5);
        particle.blur = 1.0;
        particle.speed = (Math.random() * speedrange) + minspeed;
        particle.opacity = 1.0;
        particles.push(particle);
    }

    /*
     Animate particle movement
     */
    function animate() {
        respawnParticles();
        evolveParticles();
        var newcss = getBoxShadows();
        $('#particleSpawner').animate({boxShadow: newcss}, 1000, function(){});
    }

    /*
     Get the css box shadow styles for the given particles
     */
    function getBoxShadows(){
        var xpos = particles[0].rad*Math.cos(particles[0].theta);
        var ypos = particles[0].rad*Math.sin(particles[0].theta);
        var css = xpos+"px "+ypos+"px "+particles[0].blur+"px "+particles[0].size+"px rgba(255, 255, 255, "+particles[0].opacity+")";
        for (var i = 1; i < particles.length; i++) {
            xpos = particles[i].rad*Math.cos(particles[i].theta);
            ypos = particles[i].rad*Math.sin(particles[i].theta);
            css = css +", "+xpos+"px "+ypos+"px "+particles[0].blur+"px "+particles[i].size+"px rgba(255, 255, 255, "+particles[i].opacity+")";
        }
        return css;
    }

    /*
     If particles are outside the designated circle respawn them in the center again
     */
    function respawnParticles(){
        for (i = 0; i < particles.length; i++) {
            if(particles[i].rad > maxrad){
                particles[i].rad = 5;
                particles[i].theta = (Math.random() * 360)*Math.PI/180;
                particles[i].size = Math.trunc(Math.random() * 1.5);
                particles[i].speed = (Math.random() * speedrange) + minspeed;
            }
        }
        //Quickly reset particles to center if they are out of the set bounds
        $('#particleSpawner').animate({boxShadow: getBoxShadows()}, 10, function(){});
    }

    function evolveParticles(){
        for (i = 0; i < particles.length; i++) {
            //Fade out, also does fade in due to the animation
            particles[i].opacity = (maxrad-particles[i].rad)/maxrad;
            particles[i].rad = particles[i].rad + particles[i].speed;
        }
    }

    //Preload shadow boxes for animating
    var boxes = getBoxShadows();
    $('#particleSpawner').css('box-shadow', boxes);

    animate; // on load
    setInterval(animate, 500); // set to run continously

});