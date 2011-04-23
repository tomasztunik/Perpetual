// image scaling algorithms

/*
    IMAGE SCALING (reading imageData) DOESN'T WORK ON LOCAL FILES 
*/

var is = {};

is.pixelsAreEqual = function(p1, p2) {
    return (p1.r == p2.r && p1.g == p2.g && p1.b == p2.b && p1.a == p2.a)
}
// Scale2x 
// http://scale2x.sourceforge.net/
// only upscalling - by the factor of 2
// accepts image or canvas as an input and returns canvas as an output
is.Scale2x = function(input_buffer) {

    if (input_buffer instanceof Image) {
        var tmp = document.createElement('canvas');
        tmp.width = input_buffer.width;
        tmp.height = input_buffer.height;
        tmp.getContext('2d').drawImage(input_buffer, 0, 0);
        input_buffer = tmp;
    }

    var input_pixel_data = input_buffer.getContext('2d').getImageData(0, 0, input_buffer.width, input_buffer.height).data,
        output_buffer = document.createElement('canvas'),
        output_image_data;

    output_buffer.width = input_buffer.width * 2;
    output_buffer.height = input_buffer.height * 2;
    output_buffer = output_buffer.getContext('2d');
    output_image_data = output_buffer.getImageData(0, 0, input_buffer.width * 2, input_buffer.height * 2);

    var C = {}, T = {}, R = {}, L = {}, B = {}, ETL = {}, ETR = {}, EBL = {}, EBR = {}, pp = 0, mi = 0, mj = 0, tleq, trbeq, bleq, breq;
    for (var i = 0, n = input_buffer.width; i < n; i++) {
        for (var j = 0, m = input_buffer.height; j < m; j++) {

            pp = j * input_buffer.width * 4 + i * 4;

            // get Central pixel
            C.r = input_pixel_data[pp];
            C.g = input_pixel_data[pp + 1];
            C.b = input_pixel_data[pp + 2];
            C.a = input_pixel_data[pp + 3];

            // Assign to all expanded pixels values of the central pixel
            ETL.r = ETR.r = EBL.r = EBR.r = C.r;
            ETL.g = ETR.g = EBL.g = EBR.g = C.g;
            ETL.b = ETR.b = EBL.b = EBR.b = C.b;
            ETL.a = ETR.a = EBL.a = EBR.a = C.a;

            // get Top pixel
            mi = i;
            mj = j - 1;

            // we need to test if comparison pixels aren't out of bounds 
            // and if so treat them as if they were same as central
            if (mj < 0) {
                T.r = C.r;
                T.g = C.g;
                T.b = C.b;
                T.a = C.a;
            }  else {
                pp = mj * input_buffer.width * 4 + mi * 4;
                T.r = input_pixel_data[pp];
                T.g = input_pixel_data[pp + 1];
                T.b = input_pixel_data[pp + 2];
                T.a = input_pixel_data[pp + 3];
            }

            // get Right pixel
            mi = i + 1;
            mj = j;

            if (mi == input_buffer.width) {
                R.r = C.r;
                R.g = C.g;
                R.b = C.b;
                R.a = C.a;
            } else {
                pp = mj * input_buffer.width * 4 + mi * 4;
                R.r = input_pixel_data[pp];
                R.g = input_pixel_data[pp + 1];
                R.b = input_pixel_data[pp + 2];
                R.a = input_pixel_data[pp + 3];
            }

            // get Left pixel
            mi = i - 1;
            mj = j;

            if (mi < 0) {
                L.r = C.r;
                L.g = C.g;
                L.b = C.b;
                L.a = C.a;
            } else {
                pp = mj * input_buffer.width * 4 + mi * 4;
                L.r = input_pixel_data[pp];
                L.g = input_pixel_data[pp + 1];
                L.b = input_pixel_data[pp + 2];
                L.a = input_pixel_data[pp + 3];
            }

            // get Bottom pixel
            mi = i;
            mj = j + 1;

            if (mj == input_buffer.height) {
                B.r = C.r;
                B.g = C.g;
                B.b = C.b;
                B.a = C.a;
            } else {
                pp = mj * input_buffer.width * 4 + mi * 4;
                B.r = input_pixel_data[pp];
                B.g = input_pixel_data[pp + 1];
                B.b = input_pixel_data[pp + 2];
                B.a = input_pixel_data[pp + 3];
            }

            // test for neighbour pixels equality
            // cache comparison values to reduce fn calls
            tleq = is.pixelsAreEqual(T, L);
            treq = is.pixelsAreEqual(T, R);
            bleq = is.pixelsAreEqual(B, L);
            breq = is.pixelsAreEqual(B, R);

            // test for top left pixel;
            if (tleq && !bleq && !treq) {
                ETL.r = T.r;
                ETL.g = T.g;
                ETL.b = T.b;
                ETL.a = T.a;
            }

            // test for top right pixel
            if (treq && !tleq && !breq) {
                ETR.r = R.r;
                ETR.g = R.g;
                ETR.b = R.b;
                ETR.a = R.a;
            }

            // test for bottom left pixel 
            if (bleq && !breq && !tleq) {
                EBL.r = L.r;
                EBL.g = L.g;
                EBL.b = L.b;
                EBL.a = L.a;
            }

            // tet for bottom right pixel
            if (breq && !treq && !bleq) {
                EBR.r = B.r;
                EBR.g = B.g;
                EBR.b = B.b;
                EBR.a = B.a;
            }

            // put the expanded pixels to the tmp buffer
            pp = j * 2 * input_buffer.width * 4 * 2 + i * 4 * 2;
            output_image_data.data[pp] = ETL.r;
            output_image_data.data[pp + 1] = ETL.g;
            output_image_data.data[pp + 2] = ETL.b;
            output_image_data.data[pp + 3] = ETL.a;
            output_image_data.data[pp + 4] = ETR.r;
            output_image_data.data[pp + 5] = ETR.g;
            output_image_data.data[pp + 6] = ETR.b;
            output_image_data.data[pp + 7] = ETR.a;
            pp = (j * 2 + 1) * input_buffer.width * 4 * 2 + i * 4 * 2;
            output_image_data.data[pp] = EBL.r;
            output_image_data.data[pp + 1] = EBL.g;
            output_image_data.data[pp + 2] = EBL.b;
            output_image_data.data[pp + 3] = EBL.a;
            output_image_data.data[pp + 4] = EBR.r;
            output_image_data.data[pp + 5] = EBR.g;
            output_image_data.data[pp + 6] = EBR.b;
            output_image_data.data[pp + 7] = EBR.a;
        }
    }

    output_buffer.putImageData(output_image_data, 0, 0);

    return output_buffer.canvas;
}

is.Scale4x = function(buffer) {
    return is.Scale2x(is.Scale2x(buffer));
}

is.Scale8x = function(buffer) {
    return is.Scale2x(is.Scale2x(is.Scale2x(buffer)));
}

is.Neighbour = function(input_buffer, ratio) {
    if (input_buffer instanceof Image) {
        var tmp = document.createElement('canvas');
        tmp.width = input_buffer.width;
        tmp.height = input_buffer.height;
        tmp.getContext('2d').drawImage(input_buffer, 0, 0);
        input_buffer = tmp;
    }

    if (!ratio) ratio = 2;

    var input_pixel_data = input_buffer.getContext('2d').getImageData(0, 0, input_buffer.width, input_buffer.height).data,
        output_buffer = document.createElement('canvas'),
        output_image_data;

    output_buffer.width = input_buffer.width * ratio;
    output_buffer.height = input_buffer.height * ratio;
    output_buffer = output_buffer.getContext('2d');
    output_image_data = output_buffer.getImageData(0, 0, input_buffer.width * ratio, input_buffer.height * ratio);

    var r, g, b, a, pp;
    for (var i = 0, n = input_buffer.width; i < n; i++) {
        for (var j = 0, m = input_buffer.height; j < m; j++) {
            pp = j * input_buffer.width * 4 + i * 4;
            r = input_pixel_data[pp];
            g = input_pixel_data[pp + 1];
            b = input_pixel_data[pp + 2];
            a = input_pixel_data[pp + 3];

            for (var k = 0; k < ratio; k++) {
                for (var l = 0; l < ratio; l++) {
                    pp = (j * ratio + k) * input_buffer.width * 4 * ratio + i * 4 * ratio + l * 4;
                    output_image_data.data[pp] = r;
                    output_image_data.data[pp + 1] = g;
                    output_image_data.data[pp + 2] = b;
                    output_image_data.data[pp + 3] = a;
                }
            }
        }
    }

    output_buffer.putImageData(output_image_data, 0, 0);

    return output_buffer.canvas;
}