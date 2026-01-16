const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const courses = JSON.parse(data);
            console.log(`\n✅ API Response:`);
            console.log(`   Total courses returned: ${courses.length}`);
            console.log(`\n📚 Courses:`);
            courses.forEach((course, idx) => {
                console.log(`   ${idx + 1}. ${course.title} - ₹${course.price}`);
            });
        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
});

req.end();
