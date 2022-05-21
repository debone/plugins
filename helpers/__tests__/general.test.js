/* globals describe, expect, test, DataStore, afterAll */
import * as g from '../general'

import colors from 'chalk'
import * as c from '../config'

const FILE = `${colors.yellow('helpers/general')}`
const section = colors.blue

describe(`${FILE}`, () => {
  describe(section('createLink()'), () => {
    test('should create a link with a heading', () => {
      expect(g.createLink('foo', 'bar')).toEqual('[[foo#bar]]')
    })
    test('should create a link if heading is missing', () => {
      expect(g.createLink('foo')).toEqual('[[foo]]')
    })
    test('should create a link with heading passed as null', () => {
      expect(g.createLink('foo', null)).toEqual('[[foo]]')
    })
    test('should create a link with heading passed as empty string', () => {
      expect(g.createLink('foo', '')).toEqual('[[foo]]')
    })
  })
  describe(section('createOpenNoteCallbackUrl()'), () => {
    describe('using noteTitle', () => {
      test('should create a link with a heading', () => {
        expect(g.createOpenNoteCallbackUrl('foo', false, 'bar')).toEqual('noteplan://x-callback-url/openNote?noteTitle=foo#bar')
      })
      test('should create a link if heading is missing', () => {
        expect(g.createOpenNoteCallbackUrl('foo')).toEqual('noteplan://x-callback-url/openNote?noteTitle=foo')
      })
      test('should create a link with heading passed as null', () => {
        expect(g.createOpenNoteCallbackUrl('foo', false, null)).toEqual('noteplan://x-callback-url/openNote?noteTitle=foo')
      })
      test('should create a link with heading passed as empty string', () => {
        expect(g.createOpenNoteCallbackUrl('foo', false, '')).toEqual('noteplan://x-callback-url/openNote?noteTitle=foo')
      })
    })
    describe('using note filename', () => {
      // Note the following is the proper test for how it should work for filename with a heading
      // re-enable this test when @eduard fixes API bug
      // should also add a test for a filename with parentheses
      test('should create a link with filename with parentheses', () => {
        expect(g.createOpenNoteCallbackUrl('foo/bar(xx)', true, 'bar')).toEqual('noteplan://x-callback-url/openNote?filename=foo%2Fbar%28xx%29')
      })
      test('should create a urlencoded link for spaces', () => {
        expect(g.createOpenNoteCallbackUrl('foo bar', true, 'bar')).toEqual('noteplan://x-callback-url/openNote?filename=foo%20bar')
      })
      test.skip('should create a link with a heading', () => {
        expect(g.createOpenNoteCallbackUrl('foo', true, 'bar')).toEqual('noteplan://x-callback-url/openNote?filename=foo#bar')
      })
      test('should create a link stripping the heading for the API bug workaround', () => {
        expect(g.createOpenNoteCallbackUrl('foo', true, 'bar')).toEqual('noteplan://x-callback-url/openNote?filename=foo')
      })
    })
  })

  describe(section(`createRunPluginCallbackUrl`), () => {
    test('should create a link with a heading', () => {
      expect(g.createRunPluginCallbackUrl(`dwertheimer.DataQuerying`, `runSearch`, [`New Note - 43.9400`])).toEqual(`[baz](${xcb}foo#bar)`)
    })
  })

  describe(section('createPrettyOpenNoteLink()'), () => {
    describe('using noteTitle', () => {
      const xcb = `noteplan://x-callback-url/openNote?noteTitle=`
      test('should create a link with a heading', () => {
        expect(g.createPrettyOpenNoteLink('baz', 'foo', false, 'bar')).toEqual(`[baz](${xcb}foo#bar)`)
      })
      test('should create a link if heading is missing', () => {
        expect(g.createPrettyOpenNoteLink('baz', 'foo')).toEqual(`[baz](${xcb}foo)`)
      })
      test('should create a link with heading passed as null', () => {
        expect(g.createPrettyOpenNoteLink('baz', 'foo', false, null)).toEqual(`[baz](${xcb}foo)`)
      })
    })
    describe('using note filename', () => {
      // Note the following is the proper test for how it should work for filename with a heading
      // re-enable this test when @eduard fixes API bug

      test.skip('should create a link with a heading', () => {
        expect(g.createPrettyOpenNoteLink('baz', 'foo', true, 'bar')).toEqual('[baz](noteplan://x-callback-url/openNote?filename=foo#bar)')
      })
    })
    describe(section('stripLinkFromString()'), () => {
      describe('using internal wikilinks', () => {
        test('should strip a link from a string', () => {
          expect(g.stripLinkFromString('foo [[bar]] baz')).toEqual('foo baz')
        })
        test('should strip a link from a string with a heading', () => {
          expect(g.stripLinkFromString('foo [[bar#heading]] baz')).toEqual('foo baz')
        })
        test('should strip a link from a string with a heading and trailing text', () => {
          expect(g.stripLinkFromString('foo [[bar#heading]] baz quux')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links', () => {
          expect(g.stripLinkFromString('foo [[bar#heading]] baz [[quux]] quux')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links and multiple headings', () => {
          expect(g.stripLinkFromString('foo [[bar#heading]] baz [[quux#heading]] quux')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links and multiple headings and multiple links', () => {
          expect(g.stripLinkFromString('foo [[bar#heading]] baz [[quux#heading]] quux [[foo#heading]]')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links and multiple headings and multiple links and multiple headings', () => {
          expect(g.stripLinkFromString('foo [[bar#heading]] baz [[quux#heading]] quux [[foo#heading]] [[bar#heading]]')).toEqual('foo baz quux')
        })
      })
      describe('using full urls', () => {
        test('should strip a link from a string', () => {
          expect(g.stripLinkFromString('foo [bar](http://www.google.com) baz')).toEqual('foo baz')
        })
        test('should strip a link from a string with a heading', () => {
          expect(g.stripLinkFromString('foo [bar](http://www.google.com#heading) baz')).toEqual('foo baz')
        })
        test('should strip a link from a string with a heading and trailing text', () => {
          expect(g.stripLinkFromString('foo [bar](http://www.google.com#heading) baz quux')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links', () => {
          expect(g.stripLinkFromString('foo [bar](http://www.google.com#heading) baz [bar](http://www.google.com#heading) quux')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links and multiple headings', () => {
          expect(g.stripLinkFromString('foo [bar](http://www.google.com#heading) baz [bar](http://www.google.com#heading) quux')).toEqual('foo baz quux')
        })
        test('should strip a link from a string with a heading and trailing text and multiple links and multiple headings and multiple links', () => {
          expect(g.stripLinkFromString('foo [bar](http://www.google.com#heading) baz [bar](http://www.google.com#heading) quux [bar](http://www.google.com#heading)')).toEqual(
            'foo baz quux',
          )
        })
        test('should strip a link from a string with a heading and trailing text and multiple links and multiple headings and multiple links and multiple headings', () => {
          expect(
            g.stripLinkFromString(
              'foo [bar](http://www.google.com#heading) baz [bar](http://www.google.com#heading) quux [bar](http://www.google.com#heading) [bar](http://www.google.com#heading)',
            ),
          ).toEqual('foo baz quux')
        })
      })
    })
  })
})
