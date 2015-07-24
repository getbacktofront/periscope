import {gulp} from './stream';
import jade from 'gulp-jade';

export function test_process_stream_ok(test) {
  test.expect(1);
  gulp(jade, 'output.html', "body\n  div\n    | Hello World").then((output) => {
    test.ok(output == '<body><div>Hello World</div></body>');
    test.done();
  }, () => {
    test.ok(false, "Unreachable code");
  })
};

export function test_process_stream_bad(test) {
  test.expect(1);
  gulp(jade, 'output.html', "!").then((output) => {
    test.ok(false, "Unreachable code");
  }, (err) => {
    test.ok(err != null);
    test.done();
  })
};
