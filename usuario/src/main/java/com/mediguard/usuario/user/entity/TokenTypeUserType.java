package com.mediguard.usuario.user.entity;

import com.mediguard.usuario.user.entity.VerificationTokenEntity.TokenType;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

/**
 * Bindea TokenType contra la columna nativa token_type_enum de Postgres.
 *
 * @Enumerated(EnumType.STRING) por sí solo hace que Hibernate bindee el
 * parámetro como VARCHAR, lo que Postgres rechaza para un enum nativo
 * ("column token_type is of type token_type_enum but expression is of
 * type character varying"). Usar Types.OTHER en vez de Types.VARCHAR deja
 * que el driver de Postgres infiera el tipo real de la columna. En H2
 * (tests, MODE=PostgreSQL con token_type_enum como DOMAIN sobre VARCHAR)
 * el mismo binding funciona igual porque H2 solo espera el string.
 */
public class TokenTypeUserType implements UserType<TokenType> {

    @Override
    public int getSqlType() {
        return Types.OTHER;
    }

    @Override
    public Class<TokenType> returnedClass() {
        return TokenType.class;
    }

    @Override
    public boolean equals(TokenType x, TokenType y) {
        return Objects.equals(x, y);
    }

    @Override
    public int hashCode(TokenType x) {
        return Objects.hashCode(x);
    }

    @Override
    public TokenType nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner)
            throws SQLException {
        String value = rs.getString(position);
        return rs.wasNull() || value == null ? null : TokenType.valueOf(value);
    }

    @Override
    public void nullSafeSet(PreparedStatement st, TokenType value, int index, SharedSessionContractImplementor session)
            throws SQLException {
        if (value == null) {
            st.setNull(index, Types.OTHER);
        } else {
            st.setObject(index, value.name(), Types.OTHER);
        }
    }

    @Override
    public TokenType deepCopy(TokenType value) {
        return value;
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(TokenType value) {
        return value;
    }

    @Override
    public TokenType assemble(Serializable cached, Object owner) {
        return (TokenType) cached;
    }
}
