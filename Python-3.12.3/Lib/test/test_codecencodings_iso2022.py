# Codec encoding tests for ISO 2022 encodings.

from test import multibytecodec_support
import unittest

COMMON_CODEC_TESTS = (
    # invalid bytes
    (b"ab\xffcd", "replace", "ab\ufffdcd"),
    (b"ab\x1bdef", "replace", "ab\x1bdef"),
    (b"ab\x1b$def", "replace", "ab\ufffd"),
)


class Test_ISO2022_JP(multibytecodec_support.TestBase, unittest.TestCase):
    encoding = "iso2022_jp"
    tstring = multibytecodec_support.load_teststring("iso2022_jp")
    codectests = COMMON_CODEC_TESTS + ((b"ab\x1bNdef", "replace", "ab\x1bNdef"),)


class Test_ISO2022_JP2(multibytecodec_support.TestBase, unittest.TestCase):
    encoding = "iso2022_jp_2"
    tstring = multibytecodec_support.load_teststring("iso2022_jp")
    codectests = COMMON_CODEC_TESTS + ((b"ab\x1bNdef", "replace", "abdef"),)


class Test_ISO2022_JP3(multibytecodec_support.TestBase, unittest.TestCase):
    encoding = "iso2022_jp_3"
    tstring = multibytecodec_support.load_teststring("iso2022_jp")
    codectests = COMMON_CODEC_TESTS + (
        (b"ab\x1bNdef", "replace", "ab\x1bNdef"),
        (b"\x1b$(O\x2e\x23\x1b(B", "strict", "\u3402"),
        (b"\x1b$(O\x2e\x22\x1b(B", "strict", "\U0002000b"),
        (b"\x1b$(O\x24\x77\x1b(B", "strict", "\u304b\u309a"),
        (b"\x1b$(P\x21\x22\x1b(B", "strict", "\u4e02"),
        (b"\x1b$(P\x7e\x76\x1b(B", "strict", "\U0002a6b2"),
        ("\u3402", "strict", b"\x1b$(O\x2e\x23\x1b(B"),
        ("\U0002000b", "strict", b"\x1b$(O\x2e\x22\x1b(B"),
        ("\u304b\u309a", "strict", b"\x1b$(O\x24\x77\x1b(B"),
        ("\u4e02", "strict", b"\x1b$(P\x21\x22\x1b(B"),
        ("\U0002a6b2", "strict", b"\x1b$(P\x7e\x76\x1b(B"),
        (b"ab\x1b$(O\x2e\x21\x1b(Bdef", "replace", "ab\ufffddef"),
        ("ab\u4ff1def", "replace", b"ab?def"),
    )
    xmlcharnametest = (
        "\xab\u211c\xbb = \u2329\u1234\u232a",
        b"\x1b$(O\x29\x28\x1b(B&real;\x1b$(O\x29\x32\x1b(B = &lang;&#4660;&rang;",
    )


class Test_ISO2022_JP2004(multibytecodec_support.TestBase, unittest.TestCase):
    encoding = "iso2022_jp_2004"
    tstring = multibytecodec_support.load_teststring("iso2022_jp")
    codectests = COMMON_CODEC_TESTS + (
        (b"ab\x1bNdef", "replace", "ab\x1bNdef"),
        (b"\x1b$(Q\x2e\x23\x1b(B", "strict", "\u3402"),
        (b"\x1b$(Q\x2e\x22\x1b(B", "strict", "\U0002000b"),
        (b"\x1b$(Q\x24\x77\x1b(B", "strict", "\u304b\u309a"),
        (b"\x1b$(P\x21\x22\x1b(B", "strict", "\u4e02"),
        (b"\x1b$(P\x7e\x76\x1b(B", "strict", "\U0002a6b2"),
        ("\u3402", "strict", b"\x1b$(Q\x2e\x23\x1b(B"),
        ("\U0002000b", "strict", b"\x1b$(Q\x2e\x22\x1b(B"),
        ("\u304b\u309a", "strict", b"\x1b$(Q\x24\x77\x1b(B"),
        ("\u4e02", "strict", b"\x1b$(P\x21\x22\x1b(B"),
        ("\U0002a6b2", "strict", b"\x1b$(P\x7e\x76\x1b(B"),
        (b"ab\x1b$(Q\x2e\x21\x1b(Bdef", "replace", "ab\u4ff1def"),
        ("ab\u4ff1def", "replace", b"ab\x1b$(Q\x2e\x21\x1b(Bdef"),
    )
    xmlcharnametest = (
        "\xab\u211c\xbb = \u2329\u1234\u232a",
        b"\x1b$(Q\x29\x28\x1b(B&real;\x1b$(Q\x29\x32\x1b(B = &lang;&#4660;&rang;",
    )


class Test_ISO2022_KR(multibytecodec_support.TestBase, unittest.TestCase):
    encoding = "iso2022_kr"
    tstring = multibytecodec_support.load_teststring("iso2022_kr")
    codectests = COMMON_CODEC_TESTS + ((b"ab\x1bNdef", "replace", "ab\x1bNdef"),)

    # iso2022_kr.txt cannot be used to test "chunk coding": the escape
    # sequence is only written on the first line
    @unittest.skip('iso2022_kr.txt cannot be used to test "chunk coding"')
    def test_chunkcoding(self):
        pass


if __name__ == "__main__":
    unittest.main()
