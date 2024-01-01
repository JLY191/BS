package utils

import (
	"crypto/sha256"
	"encoding/hex"
)

func GetHashPwd(s string) string {
	hashPwd := sha256.Sum256([]byte(s))
	return hex.EncodeToString(hashPwd[:])
}
